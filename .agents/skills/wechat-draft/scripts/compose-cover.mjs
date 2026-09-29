#!/usr/bin/env node
/**
 * WeChat MP headline cover, 2.35:1 (1080x460).
 * Scale is always uniform. Flat padding on an already-wide picture is tightened
 * to about TARGET_EDGE_MARGIN when that does not pull elements apart.
 * Side margins may stay wider than the top and bottom. A flat margin over the
 * caps in SKILL.md 「封面」 exits with an error. Do not spread groups sideways
 * to eat that margin; keep their original spacing and leave the extra width
 * on the outside.
 * A different ratio is center-cropped to 2.35:1, never stretched, then the
 * finished frame is measured again and rejected if a flat margin is still over the cap.
 * Also writes cover-11.jpg, the center 1:1 share crop.
 *
 * Usage:
 *   node compose-cover.mjs --image <src> --out <cover-235.jpg>
 */
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

export const COVER_W = 1080;
export const COVER_H = 460;
/** SKILL.md 「封面」：左右空白可以更宽，超过 18% 才失败。 */
export const MAX_EDGE_MARGIN_X = 0.18;
/** SKILL.md 「封面」：上下空白不超过 8%。 */
export const MAX_EDGE_MARGIN_Y = 0.08;
/** SKILL.md 「封面」：整幅已经接近封面比例时，均匀白边收到约 3%。 */
export const TARGET_EDGE_MARGIN = 0.03;
const EDGE_LIMIT = {
  left: MAX_EDGE_MARGIN_X,
  right: MAX_EDGE_MARGIN_X,
  top: MAX_EDGE_MARGIN_Y,
  bottom: MAX_EDGE_MARGIN_Y,
};
const RATIO_TOLERANCE = 0.03;
const INK_DISTANCE = 24;

const SIDE_LABEL = { left: '左', right: '右', top: '上', bottom: '下' };

function arg(name, fallback = '') {
  const i = process.argv.indexOf(name);
  if (i === -1 || i + 1 >= process.argv.length) return fallback;
  return process.argv[i + 1];
}

function colorDist(p, mean) {
  const dr = p[0] - mean[0];
  const dg = p[1] - mean[1];
  const db = p[2] - mean[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

export function ratioClose(width, height) {
  const target = COVER_W / COVER_H;
  if (!width || !height) return false;
  return Math.abs(width / height - target) / target <= RATIO_TOLERANCE;
}

/**
 * Blank margin of a flat canvas, as a fraction of each side.
 * Photos and other non-flat edges are marked flat:false and left alone.
 */
export async function measureEdgeMargins(src) {
  const { data, info } = await sharp(src)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const band = Math.max(2, Math.round(Math.min(w, h) * 0.012));
  const step = Math.max(1, Math.floor(Math.min(w, h) / 400));
  let border = 0;
  let transparent = 0;
  const opaque = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const onEdge = x < band || y < band || x >= w - band || y >= h - band;
      if (!onEdge) continue;
      border += 1;
      const i = (y * w + x) * c;
      if (data[i + 3] < 16) {
        transparent += 1;
        continue;
      }
      opaque.push([data[i], data[i + 1], data[i + 2]]);
    }
  }

  let flat = false;
  let mean = [255, 255, 255];
  if (border > 0 && transparent / border >= 0.92) {
    flat = true;
  } else if (opaque.length >= 8) {
    mean = [0, 0, 0];
    for (const p of opaque) {
      mean[0] += p[0];
      mean[1] += p[1];
      mean[2] += p[2];
    }
    mean = mean.map((n) => n / opaque.length);
    const variance = [0, 0, 0];
    let close = 0;
    for (const p of opaque) {
      variance[0] += (p[0] - mean[0]) ** 2;
      variance[1] += (p[1] - mean[1]) ** 2;
      variance[2] += (p[2] - mean[2]) ** 2;
      if (colorDist(p, mean) <= 18) close += 1;
    }
    const std = variance.map((v) => Math.sqrt(v / opaque.length));
    flat = std.every((s) => s <= 12) && close / opaque.length >= 0.92;
  }

  const rowInk = new Uint32Array(h);
  const colInk = new Uint32Array(w);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      const i = (row + x) * c;
      if (data[i + 3] < 16) continue;
      const p = [data[i], data[i + 1], data[i + 2]];
      if (colorDist(p, mean) > INK_DISTANCE) {
        rowInk[y] += 1;
        colInk[x] += 1;
      }
    }
  }
  const rowMin = Math.max(3, Math.floor(w * 0.0015));
  const colMin = Math.max(3, Math.floor(h * 0.0015));
  let top = 0;
  let bottom = h - 1;
  let left = 0;
  let right = w - 1;
  while (top < h && rowInk[top] < rowMin) top += 1;
  while (bottom >= 0 && rowInk[bottom] < rowMin) bottom -= 1;
  while (left < w && colInk[left] < colMin) left += 1;
  while (right >= 0 && colInk[right] < colMin) right -= 1;

  const empty = top > bottom || left > right;
  const box = empty
    ? null
    : { left, top, width: right - left + 1, height: bottom - top + 1 };
  const ratios = empty
    ? { left: 1, right: 1, top: 1, bottom: 1 }
    : {
        left: left / w,
        right: (w - 1 - right) / w,
        top: top / h,
        bottom: (h - 1 - bottom) / h,
      };
  return {
    width: w,
    height: h,
    flat,
    background: mean.map((n) => Math.round(Math.min(255, Math.max(0, n)))),
    box,
    ratios,
  };
}

export function formatMargins(measured) {
  if (!measured?.flat || !ratioClose(measured.width, measured.height)) return 'n/a';
  const pct = (n) => `${(n * 100).toFixed(1)}%`;
  const r = measured.ratios;
  return `L${pct(r.left)} R${pct(r.right)} T${pct(r.top)} B${pct(r.bottom)}`;
}

function marginFailure(measured) {
  if (!measured.flat || !ratioClose(measured.width, measured.height)) return '';
  const slack = 1 / Math.min(measured.width, measured.height);
  const over = Object.entries(measured.ratios).filter(
    ([side, ratio]) => ratio > EDGE_LIMIT[side] + slack,
  );
  if (!over.length) return '';
  const pct = (n) => `${(n * 100).toFixed(1)}%`;
  const r = measured.ratios;
  const detail = ['left', 'right', 'top', 'bottom']
    .map((side) => `${SIDE_LABEL[side]} ${pct(r[side])}`)
    .join(' ');
  const exceeded = over.map(([side]) => SIDE_LABEL[side]).join('、');
  return `封面留白超标：${detail}。超标的是${exceeded}。左右不超过 ${(MAX_EDGE_MARGIN_X * 100).toFixed(0)}%，上下不超过 ${(MAX_EDGE_MARGIN_Y * 100).toFixed(0)}%。保持元素之间原来的间距，多出来的空间留在左右外侧，不要把一组内容向两侧扯开。`;
}

function marginsAt(box, width, height, scale) {
  return {
    x: (width - box.width * scale) / 2 / width,
    y: (height - box.height * scale) / 2 / height,
  };
}

function withinCap(margins) {
  return margins.x <= MAX_EDGE_MARGIN_X + 1e-9 && margins.y <= MAX_EDGE_MARGIN_Y + 1e-9;
}

async function tightenFlatMargins(src, measured) {
  if (!measured.flat || !measured.box || !ratioClose(measured.width, measured.height)) return null;
  const over = Object.entries(measured.ratios).some(
    ([side, ratio]) => ratio > EDGE_LIMIT[side] + 1e-9,
  );
  if (!over) return null;
  const { width: w, height: h, box } = measured;
  const scaleMax = Math.min(w / box.width, h / box.height);
  if (!(scaleMax > 1.001)) return null;
  if (!withinCap(marginsAt(box, w, h, scaleMax))) return null;
  const scaleTarget = scaleMax * (1 - 2 * TARGET_EDGE_MARGIN);
  let scale = scaleMax;
  if (scaleTarget > 1 && withinCap(marginsAt(box, w, h, scaleTarget))) scale = scaleTarget;
  let newW = Math.round(box.width * scale);
  let newH = Math.round(box.height * scale);
  if (newW > w) newW = w;
  if (newH > h) newH = h;
  if (newW < 1 || newH < 1) return null;
  const left = Math.floor((w - newW) / 2);
  const top = Math.floor((h - newH) / 2);
  const placed = {
    width: w,
    height: h,
    flat: true,
    ratios: {
      left: left / w,
      right: (w - left - newW) / w,
      top: top / h,
      bottom: (h - top - newH) / h,
    },
  };
  if (marginFailure(placed)) return null;
  const [red, green, blue] = measured.background;
  const extracted = await sharp(src)
    .rotate()
    .extract(box)
    .resize({ width: newW, height: newH, fit: 'fill' })
    .toBuffer();
  const buffer = await sharp({
    create: {
      width: w,
      height: h,
      channels: 3,
      background: { r: red, g: green, b: blue },
    },
  })
    .composite([{ input: extracted, left, top }])
    .png()
    .toBuffer();
  return { buffer, placed };
}

async function writeSquare(widePath, out) {
  const side = COVER_H;
  const left = Math.floor((COVER_W - side) / 2);
  const squarePath = path.join(path.dirname(out), 'cover-11.jpg');
  await sharp(widePath)
    .extract({ left, top: 0, width: side, height: side })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(squarePath);
  return squarePath;
}

export async function composeCover(src, out) {
  await mkdir(path.dirname(out), { recursive: true });
  const measured = await measureEdgeMargins(src);
  let input = src;
  const tightened = await tightenFlatMargins(src, measured);
  let margins = measured;
  if (tightened) {
    input = tightened.buffer;
    margins = tightened.placed;
    console.log('cover tighten', formatMargins(measured), '->', formatMargins(margins));
  }
  const failure = marginFailure(margins);
  if (failure) {
    const err = new Error(failure);
    err.code = 'COVER_MARGIN';
    throw err;
  }
  const meta = await sharp(input).rotate().metadata();
  const sw = meta.width || COVER_W;
  const sh = meta.height || COVER_H;
  await sharp(input)
    .rotate()
    .resize({
      width: COVER_W,
      height: COVER_H,
      fit: 'cover',
      position: 'centre',
    })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(out);
  const outputMargins = await measureEdgeMargins(out);
  const outputFailure = marginFailure(outputMargins);
  if (outputFailure) {
    await rm(out, { force: true });
    const err = new Error(outputFailure);
    err.code = 'COVER_MARGIN';
    throw err;
  }
  margins = outputMargins.flat ? outputMargins : margins;
  const squarePath = await writeSquare(out, out);
  const written = await sharp(out).metadata();
  console.log(
    'cover',
    out,
    `${written.width}x${written.height}`,
    `from ${sw}x${sh}`,
    'uniform',
    'margins',
    formatMargins(margins),
    'square',
    squarePath,
  );
}

async function main() {
  const src = arg('--image');
  const out = arg('--out');
  if (!src || !out) {
    console.error('usage: node compose-cover.mjs --image <src> --out <cover-235.jpg>');
    process.exit(2);
  }
  await composeCover(src, out);
}

const invoked =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invoked) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
