#!/usr/bin/env python3
"""Upsert a WeChat MP draft from a skill preview directory.

Uses the already-logged-in Chrome session for mp.weixin.qq.com.
Always declares the article as original. Does not publish / mass-send.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import random
import re
import shutil
import sqlite3
import subprocess
import tempfile
import time
from pathlib import Path
from urllib.parse import quote

import requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

HERE = Path(__file__).resolve().parent
SKILL_ROOT = HERE.parent
PREVIEW_ROOT = SKILL_ROOT / "preview"


def repo_root() -> Path:
    try:
        out = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            cwd=HERE,
            check=True,
            capture_output=True,
            text=True,
        ).stdout.strip()
        if out:
            return Path(out)
    except (OSError, subprocess.CalledProcessError):
        pass
    return HERE.parents[3]


REPO = repo_root()
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)
# Normalized crop boxes on a 2.35:1 cover (origin top-left, 0–1).
CROP_BOXES = {
    "2.35_1": (0.0, 0.0, 1.0, 1.0),
    "1_1": (0.287037, 0.0, 0.712963, 1.0),
    "16_9": (0.122, 0.0, 0.878, 1.0),
    "3_4": (0.3405, 0.0, 0.6595, 1.0),
}
TITLE_MAX = 64
DIGEST_MAX = 120
AUTHOR_MAX = 16
APPMSG_TYPE = 77


def chrome_cookies() -> dict[str, str]:
    password = subprocess.run(
        ["security", "find-generic-password", "-w", "-s", "Chrome Safe Storage", "-a", "Chrome"],
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()
    key = hashlib.pbkdf2_hmac("sha1", password.encode(), b"saltysalt", 1003, dklen=16)
    src = Path(
        os.environ.get(
            "WECHAT_MP_COOKIE_DB",
            str(Path.home() / "Library/Application Support/Google/Chrome/Default/Cookies"),
        )
    )
    if not src.exists():
        raise RuntimeError(f"Chrome cookie DB not found: {src}")
    tmp = tempfile.mktemp(suffix=".db")
    shutil.copy2(src, tmp)
    con = sqlite3.connect(tmp)
    rows = con.execute(
        "select host_key, name, encrypted_value from cookies "
        "where host_key in ('mp.weixin.qq.com', '.mp.weixin.qq.com')"
    ).fetchall()
    con.close()
    os.remove(tmp)
    cookies: dict[str, str] = {}
    for _host, name, ev in rows:
        if not ev or not ev.startswith(b"v10"):
            continue
        cipher = AES.new(key, AES.MODE_CBC, iv=b" " * 16)
        pt = unpad(cipher.decrypt(ev[3:]), 16)
        raw = (pt[32:] if len(pt) > 32 else pt).decode("ascii", "ignore")
        # Cookie headers reject control characters. Drop that cookie so a
        # corrupted value cannot block the rest of the Chrome session.
        if raw and all(32 <= ord(ch) < 127 for ch in raw):
            cookies[name] = raw
    return cookies


def session_with_token():
    cookies = chrome_cookies()
    if "slave_user" not in cookies or "slave_sid" not in cookies:
        raise RuntimeError(
            "WeChat MP cookies missing; open https://mp.weixin.qq.com in Chrome and login"
        )
    sess = requests.Session()
    sess.headers.update(
        {
            "User-Agent": UA,
            "Referer": "https://mp.weixin.qq.com/",
            "Origin": "https://mp.weixin.qq.com",
        }
    )
    for n, v in cookies.items():
        sess.cookies.set(n, v, domain="mp.weixin.qq.com", path="/")
    r = sess.get("https://mp.weixin.qq.com/", allow_redirects=True, timeout=20)
    r.raise_for_status()
    token_m = re.search(r"token=(\d+)", r.url)
    ticket_m = re.search(r'ticket:\s*"([0-9a-f]+)"', r.text)
    if not token_m:
        token_m = re.search(r"token=(\d+)", r.text)
    if not token_m or not ticket_m:
        raise RuntimeError(
            "WeChat MP session expired; open https://mp.weixin.qq.com in Chrome and login again"
        )
    return sess, token_m.group(1), ticket_m.group(1), cookies["slave_user"]


def upload_image(sess, token, ticket, slave_user, path: Path, scene: int = 8) -> tuple[str, str]:
    params = {
        "action": "upload_material",
        "f": "json",
        "scene": scene,
        "writetype": "doublewrite",
        "groupid": 1,
        "ticket_id": slave_user,
        "ticket": ticket,
        "svr_time": str(int(time.time())),
        "token": token,
        "lang": "zh_CN",
        "seq": str(int(time.time() * 1000)),
    }
    suffix = path.suffix.lower()
    mime = "image/png" if suffix == ".png" else "image/jpeg"
    with path.open("rb") as f:
        r = sess.post(
            "https://mp.weixin.qq.com/cgi-bin/filetransfer",
            params=params,
            files={"file": (path.name, f, mime)},
            timeout=60,
        )
    data = r.json()
    if data.get("base_resp", {}).get("ret") != 0:
        raise RuntimeError(f"upload failed {path.name}: {data}")
    cdn = data["cdn_url"].replace("\\/", "/")
    if cdn.startswith("http://"):
        cdn = "https://" + cdn[len("http://") :]
    return str(data["content"]), cdn


def crop_boxes(fileid: str) -> list[dict]:
    boxes = []
    for ratio, (x1, y1, x2, y2) in CROP_BOXES.items():
        boxes.append(
            {
                "ratio": ratio,
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2,
                "file_id": int(fileid) if str(fileid).isdigit() else fileid,
            }
        )
    for extra in ("video", "finder"):
        boxes.append({"ratio": extra, "x1": 0, "y1": 0, "x2": 0, "y2": 0, "file_id": 0})
    return boxes


def crop_cover(sess, token, fileid: str, cdn: str) -> tuple[str, str]:
    """Ask MP to cut 2.35:1 and 1:1 covers. Fall back to the original CDN."""
    size_list = crop_boxes(fileid)[:2]
    payload = {
        "token": token,
        "lang": "zh_CN",
        "f": "json",
        "ajax": 1,
        "imgurl": cdn,
        "size_count": 2,
        "list": json.dumps(size_list, ensure_ascii=False),
    }
    r = sess.post(
        "https://mp.weixin.qq.com/cgi-bin/cropimage",
        params={"action": "crop_multi", "token": token, "lang": "zh_CN", "f": "json", "ajax": 1},
        data=payload,
        timeout=30,
    )
    try:
        data = r.json()
    except ValueError:
        return cdn, cdn
    if data.get("base_resp", {}).get("ret") not in (0, "0", None):
        return cdn, cdn
    urls = []
    for key in ("result", "list", "cdn_url_list"):
        val = data.get(key)
        if isinstance(val, list):
            urls = val
            break
    cropped = []
    for item in urls:
        if isinstance(item, str) and item.startswith("http"):
            cropped.append(item.replace("\\/", "/"))
        elif isinstance(item, dict):
            u = item.get("cdn_url") or item.get("url") or ""
            if u:
                cropped.append(u.replace("\\/", "/"))
    if len(cropped) >= 2:
        return cropped[0], cropped[1]
    return cdn, cdn


def _normalize_draft(item: dict) -> dict:
    app_id = item.get("app_id") or item.get("appmsgid") or item.get("appMsgId")
    return {
        "appmsgid": app_id,
        "title": (item.get("title") or "").strip(),
        "data_seq": item.get("data_seq") or 0,
        "copyright_type": item.get("copyright_type"),
    }


def list_drafts(sess, token, *, query: str = "", limit: int = 50) -> list[dict]:
    items: list[dict] = []
    begin = 0
    page = 10
    while begin < limit:
        r = sess.get(
            "https://mp.weixin.qq.com/cgi-bin/appmsg",
            params={
                "begin": begin,
                "count": page,
                "type": APPMSG_TYPE,
                "action": "list_card",
                "query": query,
                "token": token,
                "lang": "zh_CN",
                "f": "json",
                "ajax": 1,
            },
            timeout=20,
        )
        data = r.json()
        ret = data.get("base_resp", {}).get("ret")
        if ret not in (0, "0", None):
            raise RuntimeError(f"list drafts failed: {data.get('base_resp')}")
        info = data.get("app_msg_info") or {}
        batch = info.get("item") or []
        if not batch:
            r2 = sess.get(
                "https://mp.weixin.qq.com/cgi-bin/appmsg",
                params={
                    "action": "list_ex",
                    "begin": begin,
                    "count": page,
                    "query": query,
                    "type": APPMSG_TYPE,
                    "token": token,
                    "lang": "zh_CN",
                    "f": "json",
                    "ajax": 1,
                },
                timeout=20,
            )
            batch = r2.json().get("app_msg_list") or []
        if not batch:
            break
        items.extend(_normalize_draft(x) for x in batch)
        if len(batch) < page:
            break
        begin += page
        time.sleep(0.2)
    return items


def find_existing(
    sess, token, title: str, app_msg_id: str | int | None
) -> tuple[str | None, str | int]:
    want = title[:TITLE_MAX]
    drafts = list_drafts(sess, token, query="")
    if app_msg_id:
        sid = str(app_msg_id)
        for item in drafts:
            if str(item.get("appmsgid")) == sid:
                return sid, item.get("data_seq") or 0
    for item in drafts:
        if item.get("appmsgid") and item.get("title") == want:
            return str(item["appmsgid"]), item.get("data_seq") or 0
    return None, 0


def original_article_type(source_markdown: str) -> int:
    p = source_markdown.replace("\\", "/")
    if "/blog/" in p or "/8000-生活笔记/" in p:
        return 17
    return 8


def save_draft(
    sess,
    token,
    *,
    app_msg_id: str | None,
    data_seq: str | int,
    title: str,
    author: str,
    digest: str,
    content: str,
    fileid: str,
    cdn: str,
    cdn_235: str,
    cdn_11: str,
    source_url: str,
    article_type: int,
) -> dict:
    boxes = crop_boxes(fileid)
    crop_payload = json.dumps({"crop_list": boxes, "crop_list_percent": boxes}, ensure_ascii=False)
    updating = bool(app_msg_id)
    data = {
        "token": token,
        "lang": "zh_CN",
        "f": "json",
        "ajax": 1,
        "random": random.random(),
        "AppMsgId": app_msg_id or "",
        "count": 1,
        "data_seq": data_seq or 0,
        "operate_from": "Chrome",
        "isnew": 0 if updating else 1,
        "title0": title,
        "digest0": digest,
        "author0": author,
        "content0": content,
        "fileid0": fileid,
        "cdn_url0": cdn,
        "cdn_url_1_10": cdn_11,
        "cdn_url_235_10": cdn_235,
        "cdn_1_1_url0": cdn_11,
        "cdn_235_1_url0": cdn_235,
        "crop_list0": crop_payload,
        "music_id0": "",
        "video_id0": "",
        "show_cover_pic0": 0,
        "copyright_type0": 1,
        "is_original0": 1,
        "need_open_comment0": 1,
        "only_fans_can_comment0": 0,
        "sourceurl0": source_url,
        "fee0": 0,
        "is_cartoon_copyright0": 0,
        "can_reward0": 0,
        "pay_gifts_count0": 0,
        "auto_elect_comment0": 0,
        "auto_elect_reply0": 0,
        "insert_ad_mode0": 0,
        "categories_list0[]": 0,
        "applyori0": 1,
        "source_item0": 0,
        "reprint_permission_flag0": 0,
        "free_content0": "",
        "platform0": "",
        "reprint_confirm0": 1,
        "original_article_type0": article_type,
        "ori_white_list0": "",
        "video_desc0": "",
        "multi_item_list0": "",
        "guide_words0": "",
        "is_share_copyright0": 0,
        "share_copyright_url0": "",
    }
    sub = "update" if updating else "create"
    url = (
        "https://mp.weixin.qq.com/cgi-bin/operate_appmsg"
        f"?t=ajax-response&sub={sub}&type={APPMSG_TYPE}&token={token}&lang=zh_CN"
    )
    r = sess.post(url, data=data, timeout=120)
    r.raise_for_status()
    return r.json()


def save_error(result: dict) -> str:
    """WeChat puts the real failure in top-level ret/msg. base_resp.ret can stay 0."""
    base = (result.get("base_resp") or {}).get("ret")
    top = result.get("ret")
    msg = str(result.get("msg") or "").strip()
    parts: list[str] = []
    if base not in (0, "0", None):
        err_msg = str((result.get("base_resp") or {}).get("err_msg") or "").strip()
        parts.append(f"base_resp.ret={base} {err_msg}".strip())
    if top not in (None, "", 0, "0"):
        parts.append(f"ret={top}")
    if msg and (parts or "无法保存" in msg):
        parts.append(msg)
    return "; ".join(parts)


def run_generate(md_path: Path) -> Path:
    cmd = ["node", str(HERE / "generate.mjs"), str(md_path)]
    subprocess.run(cmd, check=True, cwd=str(REPO))
    raw = md_path.read_text(encoding="utf-8")
    m = re.search(r'^slug:\s*"([^"]+)"', raw, re.M) or re.search(r"^slug:\s*(.+)$", raw, re.M)
    slug = (m.group(1).strip().strip('"').lstrip("/") if m else "article")
    slug = re.sub(r"[^a-z0-9-]", "-", slug, flags=re.I)
    out = PREVIEW_ROOT / slug
    if not (out / "wechat-body.html").exists():
        raise RuntimeError(f"generate.mjs did not write {out / 'wechat-body.html'}")
    return out


def compose_cover(image: Path, dest: Path) -> None:
    cmd = [
        "node",
        str(HERE / "compose-cover.mjs"),
        "--image",
        str(image),
        "--out",
        str(dest),
    ]
    subprocess.run(cmd, check=True, cwd=str(REPO))


def replace_local_images(html: str, mapping: dict[str, str]) -> str:
    out = html
    for name, cdn in mapping.items():
        out = out.replace(f'src="images/{name}"', f'src="{cdn}"')
        out = out.replace(f"src='images/{name}'", f'src="{cdn}"')
        out = out.replace(f"src=\"images/{quote(name)}\"", f'src="{cdn}"')
    return out


def preview_dir_from_arg(value: Path) -> Path:
    if value.is_dir():
        return value
    if value.suffix.lower() == ".md":
        return run_generate(value)
    raise RuntimeError(f"expected a markdown file or preview directory: {value}")


def cmd_list(sess, token) -> None:
    drafts = list_drafts(sess, token, query="")
    if not drafts:
        print("DRAFTS 0")
        return
    print(f"DRAFTS {len(drafts)}")
    for item in drafts:
        item_id = item.get("app_id") or item.get("appmsgid") or item.get("appMsgId")
        title = (item.get("title") or "").replace("\n", " ")
        print(f"{item_id}\t{title}")


def publish(preview: Path, *, cover: Path | None, dry_run: bool) -> None:
    meta_path = preview / "meta.json"
    html_path = preview / "wechat-body.html"
    img_dir = preview / "images"
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    html = html_path.read_text(encoding="utf-8")
    title = (meta.get("title") or preview.name)[:TITLE_MAX]
    digest = (meta.get("digest") or title)[:DIGEST_MAX]
    author = (meta.get("author") or "John Guo")[:AUTHOR_MAX]
    source_url = meta.get("url") or ""
    source_md = meta.get("sourceMarkdown") or ""
    article_type = original_article_type(source_md)

    cover_path = cover
    if cover_path is None:
        candidate = img_dir / "cover-235.jpg"
        if candidate.exists():
            cover_path = candidate
    if cover_path is None or not cover_path.exists():
        raise RuntimeError(
            "cover image missing: pass --cover or place images/cover-235.jpg in the preview dir"
        )
    if cover_path.resolve() != (img_dir / "cover-235.jpg").resolve():
        compose_cover(cover_path, img_dir / "cover-235.jpg")
        cover_path = img_dir / "cover-235.jpg"

    sess, token, ticket, slave_user = session_with_token()
    print("logged in as", slave_user, "token", token)

    existing, data_seq = find_existing(
        sess, token, title, (meta.get("draft") or {}).get("appMsgId")
    )
    print("existing draft", existing or "(none)", "data_seq", data_seq)
    if dry_run:
        print("DRY_RUN title", title)
        print("DRY_RUN cover", cover_path)
        print("DRY_RUN original", 1, "article_type", article_type)
        return

    cover_id, cover_cdn = upload_image(sess, token, ticket, slave_user, cover_path, scene=1)
    cdn_235, cdn_11 = crop_cover(sess, token, cover_id, cover_cdn)
    square = img_dir / "cover-11.jpg"
    # cropimage often fails and both URLs stay the wide cover, so the 1:1
    # frame letterboxes. Upload the local center square when that happens.
    if square.exists() and (cdn_11 == cover_cdn or cdn_11 == cdn_235):
        _square_id, cdn_11 = upload_image(sess, token, ticket, slave_user, square, scene=1)
        print("cover-11", _square_id)
    print("cover", cover_id)

    names = sorted(
        p.name
        for p in img_dir.iterdir()
        if p.suffix.lower() in {".jpg", ".jpeg", ".png"} and p.name not in {"cover-235.jpg", "cover-11.jpg"}
    )
    mapping: dict[str, str] = {}
    for i, name in enumerate(names, 1):
        _fid, cdn = upload_image(sess, token, ticket, slave_user, img_dir / name, scene=8)
        mapping[name] = cdn
        print(f"img {i}/{len(names)} {name}")
        time.sleep(0.15)
    html = replace_local_images(html, mapping)
    missing = re.findall(r'src="images/[^"]+"', html)
    if missing:
        raise RuntimeError(f"unreplaced images: {missing}")

    print("content bytes", len(html.encode("utf-8")))
    result = save_draft(
        sess,
        token,
        app_msg_id=existing,
        data_seq=data_seq,
        title=title,
        author=author,
        digest=digest,
        content=html,
        fileid=cover_id,
        cdn=cover_cdn,
        cdn_235=cdn_235,
        cdn_11=cdn_11,
        source_url=source_url,
        article_type=article_type,
    )
    err = save_error(result)
    if err and existing and "320002" in err:
        print("stale draft", existing, err, "; creating a new draft")
        existing = None
        result = save_draft(
            sess,
            token,
            app_msg_id=None,
            data_seq=0,
            title=title,
            author=author,
            digest=digest,
            content=html,
            fileid=cover_id,
            cdn=cover_cdn,
            cdn_235=cdn_235,
            cdn_11=cdn_11,
            source_url=source_url,
            article_type=article_type,
        )
        err = save_error(result)
    (preview / "draft-result.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2)[:8000],
        encoding="utf-8",
    )
    app_msg_id = result.get("appMsgId") or existing
    print("ret", result.get("ret", result.get("base_resp", {}).get("ret")), "appMsgId", app_msg_id)
    if err:
        print("errmsg", err)
        raise SystemExit(1)
    meta["cover"] = "images/cover-235.jpg"
    meta["draft"] = {
        "appMsgId": int(app_msg_id) if str(app_msg_id).isdigit() else app_msg_id,
        "status": "saved",
        "account": slave_user,
        "original": True,
        "updated": bool(existing),
    }
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("DRAFT_OK", app_msg_id, "update" if existing else "create")
    print(
        f"https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type={APPMSG_TYPE}"
        f"&appmsgid={app_msg_id}&token={token}&lang=zh_CN"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Upsert a WeChat MP original draft")
    parser.add_argument(
        "target",
        nargs="?",
        help="Markdown article or wechat-preview directory",
    )
    parser.add_argument("--cover", type=Path, help="Source illustration to compose into cover-235.jpg")
    parser.add_argument("--list", action="store_true", help="List current drafts and exit")
    parser.add_argument("--dry-run", action="store_true", help="Login and match drafts, do not save")
    args = parser.parse_args()

    if args.list:
        sess, token, _ticket, slave_user = session_with_token()
        print("logged in as", slave_user, "token", token)
        cmd_list(sess, token)
        return
    if not args.target:
        parser.error("target markdown or preview directory is required")
    target = Path(args.target)
    if not target.is_absolute():
        target = (Path.cwd() / target).resolve()
    preview = preview_dir_from_arg(target)
    cover = args.cover.resolve() if args.cover else None
    publish(preview, cover=cover, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
