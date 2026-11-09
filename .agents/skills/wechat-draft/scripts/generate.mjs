#!/usr/bin/env node
/**
 * Convert a johns-blog Markdown article into WeChat-ready HTML
 * that approximates the live docs typography (not site chrome).
 *
 * Usage:
 *   node .agents/skills/wechat-draft/scripts/generate.mjs <markdown-path>
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { marked, Renderer } from 'marked';
import sharp from 'sharp';
import { composeCover } from './compose-cover.mjs';

const require = createRequire(import.meta.url);
const Prism = require('prismjs');
const prismComponents = require('prismjs/components.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..');

function repoRoot() {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd: __dirname,
      encoding: 'utf8',
    }).trim();
  } catch {
    return path.resolve(__dirname, '../../../..');
  }
}

const ROOT = repoRoot();

const C = {
  text: '#172b4d',
  subtle: '#777E90',
  primary: '#2F80ED',
  code: '#c7254e',
  codeBg: '#f4f5f7',
  preBg: '#272822',
  preFg: '#f8f8f2',
  border: '#e6e8eb',
  tableHead: '#f4f6f8',
  surface: '#f9f9f9',
  infoBg: '#eef5fd',
  warnBg: '#fdf6ec',
  warn: '#e6a23c',
  white: '#ffffff',
};

const FONT =
  "-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif";
const MONO =
  "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Alt text often names how the figure was produced. Readers need what it says.
// 「四个核心问题的手绘思维导图：为何精细分工」→「四个核心问题：为何精细分工」
function imageDescription(text) {
  const processNote =
    /(?:这张|一张)?\s*(?:的\s*)?(?:手绘(?:卡通)?(?:风格)?|卡通风格)\s*(?:思维导图|信息图|脑图|插图|配图)|(?:的\s*)?信息图标题\s*(?:是|为|:|：)\s*|hand[-\s]?drawn\s+(?:mind[-\s]?maps?|infographics?)(?:\s+of)?/gi;
  let value = String(text || '').replace(processNote, '');
  value = value.replace(/的\s*(?=：|:)/g, '');
  value = value.replace(/\s+/g, ' ').trim();
  value = value.replace(/^[：:，,、；;\s]+/, '').replace(/[：:，,、；;\s]+$/, '');
  value = value.replace(/\s*：\s*/g, '：').replace(/：{2,}/g, '：');
  return value.trim();
}

// WeChat rejects a non-http href with 64562. Keep real web links, and turn
// site-root paths into the public site URL. Anchors and mailto stay empty
// so the caller can keep only the link text.
function wechatHref(href) {
  const value = String(href || '').trim();
  if (!value || value.startsWith('#') || value.toLowerCase().startsWith('mailto:')) return '';
  if (value.startsWith('/') && !value.startsWith('//')) return `https://johng.cn${value}`;
  if (value.startsWith('//')) return `https:${value}`;
  if (/^https?:\/\//i.test(value)) return value;
  return '';
}

// WeChat's editor turns source newlines into visible breaks and empty list items.
function compactForWechat(html) {
  return String(html)
    .replace(/\r\n/g, '\n')
    .replace(/>\s*\n\s*</g, '><')
    .replace(/\n+/g, ' ');
}

// Docusaurus tables use this MDX span to keep a cell on one line.
// Marked does not treat the JSX style as HTML, so WeChat shows the tag as text.
const MDX_NOWRAP_SPAN =
  /<span\s+style=\{\{\s*whiteSpace:\s*['"]nowrap['"]\s*\}\}\s*>([\s\S]*?)<\/span>/gi;

function stripMdxNowrapSpans(md) {
  const parts = String(md).split(/(```[\s\S]*?```)/g);
  return parts
    .map((part, index) => {
      if (index % 2 === 1 && part.startsWith('```')) return part;
      let cur = part;
      let prev;
      do {
        prev = cur;
        cur = cur.replace(MDX_NOWRAP_SPAN, '$1');
      } while (cur !== prev);
      return cur;
    })
    .join('');
}

// Same cascade as the site okaidia theme (prism-react-renderer plus the
// atrule / important / variable patches in docusaurus.config.ts). Later rows
// win, matching CSS. Colors equal to the code foreground are omitted: a span
// of that color wraps inner tokens, and WeChat then paints the whole line
// with the outer color.
const TOKEN_STYLES = [
  ['changed', '#a2bffc'],
  ['deleted', '#f92672'],
  ['inserted', '#addb67'],
  ['comment', '#8292a2'],
  ['prolog', '#8292a2'],
  ['cdata', '#8292a2'],
  ['string', '#a6e22e'],
  ['url', '#a6e22e'],
  ['regex', '#a6e22e'],
  ['number', '#ae81ff'],
  ['boolean', '#ae81ff'],
  ['builtin', '#e6db74'],
  ['char', '#e6db74'],
  ['constant', '#e6db74'],
  ['function', '#e6db74'],
  ['class-name', '#e6db74'],
  ['selector', '#a6e22e'],
  ['keyword', '#66d9ef'],
  ['operator', '#66d9ef'],
  ['property', '#f92672'],
  ['tag', '#f92672'],
  ['attr-name', '#a6e22e'],
  ['attr-value', '#e6db74'],
  ['symbol', '#f92672'],
  ['doctype', '#8292a2'],
  ['rule', '#e6db74'],
  ['atrule', '#e6db74'],
  ['important', '#fd971f'],
  ['variable', '#ae81ff'],
];
const TOKEN_COLOR = Object.fromEntries(TOKEN_STYLES);

const LANG_ALIAS = {
  yml: 'yaml',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  py: 'python',
  golang: 'go',
  js: 'javascript',
  ts: 'typescript',
  md: 'markdown',
  html: 'markup',
  xml: 'markup',
  dockerfile: 'docker',
  proto: 'protobuf',
  text: '',
  txt: '',
  plaintext: '',
  plain: '',
};

function loadPrismLang(id) {
  if (!id || id === 'meta') return null;
  if (Prism.languages[id]) return Prism.languages[id];
  const meta = prismComponents.languages[id];
  if (!meta) return null;
  const reqs = meta.require ? [].concat(meta.require) : [];
  for (const req of reqs) {
    if (!loadPrismLang(req)) return null;
  }
  require(`prismjs/components/prism-${id}.js`);
  return Prism.languages[id] || null;
}

function tokenColor(cls) {
  const names = new Set(cls.split(/\s+/));
  let color = '';
  for (const [name, value] of TOKEN_STYLES) {
    if (names.has(name) && value.toLowerCase() !== C.preFg.toLowerCase()) color = value;
  }
  return color;
}

function unwrapPlainSpans(html) {
  const open = '<span data-plain="1">';
  const close = '</span>';
  let result = '';
  let i = 0;
  while (i < html.length) {
    if (html.startsWith(open, i)) {
      let depth = 1;
      let j = i + open.length;
      const innerStart = j;
      while (j < html.length && depth > 0) {
        if (html.startsWith('<span', j)) {
          depth += 1;
          j = html.indexOf('>', j) + 1;
        } else if (html.startsWith(close, j)) {
          depth -= 1;
          if (depth === 0) break;
          j += close.length;
        } else {
          j += 1;
        }
      }
      result += unwrapPlainSpans(html.slice(innerStart, j));
      i = j + close.length;
    } else {
      result += html[i];
      i += 1;
    }
  }
  return result;
}

function colorizePrism(html) {
  const replaced = html.replace(/<span class="token ([^"]+)">/g, (_, cls) => {
    const color = tokenColor(cls);
    return color ? `<span style="color:${color}">` : '<span data-plain="1">';
  });
  return unwrapPlainSpans(replaced);
}

function splitHighlightedLines(html) {
  const re = /<span style="color:[^"]+">|<\/span>|\n|[^<\n]+/g;
  const parts = html.match(re);
  if (!parts || parts.join('') !== html) return null;
  const lines = [];
  const stack = [];
  let buf = '';
  for (const tok of parts) {
    if (tok === '\n') {
      for (let k = stack.length - 1; k >= 0; k -= 1) buf += '</span>';
      lines.push(buf);
      buf = stack.join('');
    } else if (tok.startsWith('<span')) {
      stack.push(tok);
      buf += tok;
    } else if (tok === '</span>') {
      stack.pop();
      buf += tok;
    } else {
      buf += tok;
    }
  }
  lines.push(buf);
  return lines;
}

function highlightFormulaLine(line) {
  const re =
    /("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\d+(?:\.\d+)?)|([A-Za-z_][\w]*)|([=+\-*/×÷<>|&%^~]+|[()[\]{},.:])|([ \t]+)|([^\s"'A-Za-z0-9_=+\-*/×÷<>|&%^~()[\]{},.:]+)/g;
  let out = '';
  let last = 0;
  for (const match of line.matchAll(re)) {
    const [all, str, num, id, op, space, other] = match;
    if (match.index > last) out += escapeHtml(line.slice(last, match.index));
    if (space) out += space;
    else if (other) out += escapeHtml(other);
    else if (str) out += `<span style="color:${TOKEN_COLOR.string}">${escapeHtml(str)}</span>`;
    else if (num) out += `<span style="color:${TOKEN_COLOR.number}">${escapeHtml(num)}</span>`;
    else if (id) out += `<span style="color:${TOKEN_COLOR.builtin}">${escapeHtml(id)}</span>`;
    else if (op) out += `<span style="color:${TOKEN_COLOR.operator}">${escapeHtml(op)}</span>`;
    last = match.index + all.length;
  }
  if (last < line.length) out += escapeHtml(line.slice(last));
  return out;
}

function highlightCodeLines(text, lang) {
  const raw = String(lang || '').trim().toLowerCase();
  const id = Object.prototype.hasOwnProperty.call(LANG_ALIAS, raw) ? LANG_ALIAS[raw] : raw;
  const source = String(text).replace(/\n$/, '');
  const lines = source.split('\n');
  if (!id) return lines.map(highlightFormulaLine);
  try {
    const grammar = loadPrismLang(id);
    if (!grammar) return lines.map(highlightFormulaLine);
    const html = colorizePrism(Prism.highlight(source, grammar, id));
    const split = splitHighlightedLines(html);
    if (split && split.length === lines.length) return split;
    return lines.map((line) => colorizePrism(Prism.highlight(line, grammar, id)));
  } catch (err) {
    console.warn('highlight', id, err.message);
    return lines.map(highlightFormulaLine);
  }
}

function freezeCodeSpaces(html) {
  return html
    .replace(/\t/g, '    ')
    .replace(/^( +)/, (spaces) => '&#160;'.repeat(spaces.length))
    .replace(/ {2,}/g, (spaces) => '&#160;'.repeat(spaces.length));
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: raw };
  const yaml = m[1];
  const body = raw.slice(m[0].length);
  const meta = {};
  const title = yaml.match(/^title:\s*"([^"]+)"/m) || yaml.match(/^title:\s*(.+)$/m);
  const slug = yaml.match(/^slug:\s*"([^"]+)"/m) || yaml.match(/^slug:\s*(.+)$/m);
  const desc =
    yaml.match(/^description:\s*"([^"]*)"/m) ||
    yaml.match(/^description:\s*'([^']*)'/m) ||
    yaml.match(/^description:\s*(\S.*)$/m);
  if (title) meta.title = title[1].trim();
  if (slug) meta.slug = slug[1].trim().replace(/^\//, '');
  if (desc) meta.description = desc[1].trim();
  return { meta, body };
}

// Bump when the renderer or theme changes so cached mermaid.ink PNGs are redrawn.
const MERMAID_RENDERER = 'mermaid-11.5.0-chrome';

function chromeBinary() {
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ];
  const found = candidates.find((item) => existsSync(item));
  if (!found) throw new Error('找不到 Chrome，无法按站点同一版 Mermaid 渲染示意图');
  return found;
}

function mermaidHtml(code) {
  const theme = {
    fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif",
    fontSize: '16px',
    primaryColor: '#EAF2FD',
    primaryTextColor: C.text,
    primaryBorderColor: C.primary,
    lineColor: '#4C5A6B',
    secondaryColor: '#F4F6F8',
    tertiaryColor: '#FFFFFF',
    noteBkgColor: '#FFF7E6',
    noteTextColor: C.text,
    actorBkg: '#EAF2FD',
    actorBorder: C.primary,
    actorTextColor: C.text,
    signalColor: C.text,
    signalTextColor: C.text,
    activationBkgColor: '#D6E8FB',
    activationBorderColor: C.primary,
    labelBoxBkgColor: '#F4F6F8',
    labelTextColor: C.text,
    clusterBkg: '#F7F9FC',
    clusterBorder: '#C5D4E8',
  };
  const script = path.join(ROOT, 'node_modules/mermaid/dist/mermaid.min.js');
  return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff}</style></head>
<body><div id="host"></div>
<script src="${pathToFileURL(script).href}"></script>
<script>
mermaid.initialize({startOnLoad:false,securityLevel:"loose",theme:"base",themeVariables:${JSON.stringify(theme)}});
mermaid.render("d1", ${JSON.stringify(code)}).then(({svg}) => {
  const host = document.getElementById("host");
  host.innerHTML = svg;
  const el = host.querySelector("svg");
  const vb = el.viewBox.baseVal;
  const w = Math.ceil(vb.width + vb.x);
  const h = Math.ceil(vb.height + vb.y);
  el.setAttribute("width", w);
  el.setAttribute("height", h);
  el.style.maxWidth = "none";
  el.style.width = w + "px";
  el.style.height = h + "px";
  document.documentElement.setAttribute("data-size", w + "x" + h);
});
</script></body></html>`;
}

function runChrome(args) {
  return execFileSync(chromeBinary(), args, {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    timeout: 60000,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
}

async function mermaidToPng(code, outPath) {
  // mermaid.ink stretches a short subgraph that links to a taller one, so the
  // first panel keeps a large blank at the bottom. Render with the site's
  // Mermaid 11.5.0 instead.
  const hash = createHash('sha1').update(`${MERMAID_RENDERER}\n${code}`).digest('hex');
  const cacheFile = path.join(path.dirname(outPath), '..', 'mermaid-cache.json');
  let cache = {};
  if (existsSync(cacheFile)) {
    try {
      cache = JSON.parse(await readFile(cacheFile, 'utf8'));
    } catch {
      cache = {};
    }
  }
  const key = path.basename(outPath);
  if (existsSync(outPath) && cache[key] === hash) return 'cached';
  const htmlPath = path.join(tmpdir(), `wechat-mermaid-${hash}.html`);
  const shotPath = path.join(tmpdir(), `wechat-mermaid-${hash}.png`);
  await writeFile(htmlPath, mermaidHtml(code));
  const page = pathToFileURL(htmlPath).href;
  const common = [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--allow-file-access-from-files',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--default-background-color=FFFFFFFF',
    '--virtual-time-budget=20000',
  ];
  const dom = runChrome([...common, '--window-size=800,600', '--dump-dom', page]);
  const size = dom.match(/data-size="(\d+)x(\d+)"/);
  if (!size) throw new Error('Mermaid 没有渲染出尺寸');
  const width = Number(size[1]);
  const height = Number(size[2]);
  runChrome([
    ...common,
    `--window-size=${width},${height}`,
    `--screenshot=${shotPath}`,
    page,
  ]);
  await sharp(shotPath).png().toFile(outPath);
  await rm(htmlPath, { force: true });
  await rm(shotPath, { force: true });
  cache[key] = hash;
  await writeFile(cacheFile, JSON.stringify(cache));
  return 'ok';
}

async function convertRaster(srcPath, outPath) {
  const img = sharp(srcPath);
  const meta = await img.metadata();
  const width = Math.min(meta.width || 1280, 1080);
  await img
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outPath);
}

function cleanHref(raw) {
  let href = String(raw).trim().replace(/^<|>$/g, '');
  const quoted = href.match(/^(\S+)\s+["'][^"']*["']$/);
  if (quoted) href = quoted[1];
  return href;
}

function resolveAsset(mdDir, href) {
  const direct = path.resolve(mdDir, href);
  if (existsSync(direct)) return direct;
  if (href.startsWith('/')) {
    const fromStatic = path.join(ROOT, 'static', href.replace(/^\/+/, ''));
    if (existsSync(fromStatic)) return fromStatic;
  }
  return direct;
}

function firstFigureHref(md) {
  const re = /```[\s\S]*?```|!\[[^\]]*]\(([^)]+)\)/g;
  let match;
  while ((match = re.exec(md))) {
    if (match[1]) return cleanHref(match[1]);
  }
  return '';
}

function extractMermaid(body) {
  const blocks = [];
  const replaced = body.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
    const i = blocks.length;
    blocks.push(code.trim());
    return `![架构或流程示意图](__MERMAID_${i}__)`;
  });
  return { body: replaced, blocks };
}

function extractAdmonitions(body) {
  return body.replace(/^:::(\w+)(?:\s+(.+))?\n([\s\S]*?)^:::\s*$/gm, (_, kind, title, inner) => {
    const label = (title || (kind === 'warning' ? '注意' : kind === 'info' ? '说明' : kind)).trim();
    return `\n\n<!--ADMONITION:${kind}:${Buffer.from(label, 'utf8').toString('base64')}-->\n${inner.trim()}\n<!--/ADMONITION-->\n\n`;
  });
}

function S(map) {
  return Object.entries(map)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}:${v}`)
    .join(';');
}

function buildRenderer(ctx) {
  const renderer = new Renderer();
  const h2 = { n: 0 };
  const h3 = { n: 0 };
  const h4 = { n: 0 };

  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    let num = '';
    if (depth === 2) {
      h2.n += 1;
      h3.n = 0;
      h4.n = 0;
      num = `${h2.n}.\u200b `;
    } else if (depth === 3) {
      h3.n += 1;
      h4.n = 0;
      num = `${h2.n}.${h3.n}.\u200b `;
    } else if (depth === 4) {
      h4.n += 1;
      num = `${h2.n}.${h3.n}.${h4.n}.\u200b `;
    }
    const styles = {
      2: S({
        display: 'block',
        fontSize: '22px',
        fontWeight: '700',
        color: C.text,
        lineHeight: '1.35',
        margin: '32px 0 14px',
        padding: '0',
        letterSpacing: '0.01em',
        textAlign: 'left',
        textIndent: '0',
      }),
      3: S({
        display: 'block',
        fontSize: '18px',
        fontWeight: '700',
        color: C.text,
        lineHeight: '1.4',
        margin: '26px 0 12px',
        padding: '0',
        textAlign: 'left',
        textIndent: '0',
      }),
      4: S({
        display: 'block',
        fontSize: '16px',
        fontWeight: '700',
        color: C.text,
        lineHeight: '1.45',
        margin: '20px 0 10px',
        padding: '0',
        textAlign: 'left',
        textIndent: '0',
      }),
    };
    const style = styles[depth] || styles[4];
    return `<section style="${style}"><span style="color:${C.primary}">${num}</span>${text}</section>`;
  };

  renderer.text = function (token) {
    const raw = token.tokens
      ? this.parser.parseInline(token.tokens)
      : token.escaped
        ? token.text
        : escapeHtml(token.text);
    return String(raw).replace(/[ \t]*\n[ \t]*/g, ' ');
  };

  renderer.paragraph = function ({ tokens }) {
    const text = this.parser.parseInline(tokens);
    if (tokens.length === 1 && tokens[0].type === 'image') return text;
    return `<p style="${S({
      margin: '0 0 16px',
      padding: '0',
      fontSize: '16px',
      lineHeight: '1.85',
      color: C.text,
      letterSpacing: '0.02em',
      textAlign: 'left',
      textIndent: '0',
    })}">${text}</p>`;
  };

  renderer.codespan = function ({ text }) {
    // WeChat treats <code> in a table cell as a block boundary and wraps the
    // following text in its own <section>, which shows up as a line break.
    return `<span style="${S({
      display: 'inline',
      fontFamily: MONO,
      fontSize: '90%',
      color: C.code,
      background: C.codeBg,
      padding: '0 3px',
      borderRadius: '3px',
      whiteSpace: 'normal',
    })}">${escapeHtml(text)}</span>`;
  };

  renderer.code = function ({ text, lang }) {
    const lineStyle = S({
      margin: '0',
      padding: '0',
      display: 'block',
      textAlign: 'left',
      textIndent: '0',
      fontFamily: MONO,
      fontSize: '13px',
      lineHeight: '1.65',
      color: C.preFg,
      whiteSpace: 'pre-wrap',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
    });
    const lines = highlightCodeLines(text, lang)
      .map((line) => {
        const frozen = freezeCodeSpaces(line);
        return `<section style="${lineStyle}">${frozen || '&#160;'}</section>`;
      })
      .join('');
    return `<section style="${S({
      margin: '12px 0 20px',
      padding: '12px 14px',
      background: C.preBg,
      borderRadius: '8px',
      textAlign: 'left',
      textIndent: '0',
      overflow: 'auto',
    })}">${lines}</section>`;
  };

  renderer.blockquote = function ({ tokens }) {
    const body = this.parser.parse(tokens);
    return `<section style="${S({
      margin: '12px 0 20px',
      padding: '10px 14px',
      borderLeft: `4px solid ${C.primary}`,
      background: '#f7f9fc',
      color: C.subtle,
    })}">${body}</section>\n`;
  };

  renderer.list = function (token) {
    const start = token.start || 1;
    const rowStyle = S({
      display: 'block',
      margin: '0 0 8px',
      padding: '0',
      textAlign: 'left',
      textIndent: '0',
      fontSize: '16px',
      lineHeight: '1.85',
      color: C.text,
    });
    const rows = token.items.map((item, index) => {
      const marker = token.ordered ? `${start + index}.\u200b` : '•';
      let inline = '';
      let blocks = '';
      for (const child of item.tokens || []) {
        if (child.type === 'list') {
          blocks += this.list(child);
        } else if (child.type === 'text' || child.type === 'paragraph') {
          const tokens = child.tokens || [
            { type: 'text', text: child.text || '', escaped: !!child.escaped },
          ];
          const piece = this.parser.parseInline(tokens).replace(/\n+/g, ' ').trim();
          if (piece) inline += (inline ? ' ' : '') + piece;
        } else {
          blocks += this.parser.parse([child]);
        }
      }
      if (item.task) inline = `${item.checked ? '☑' : '☐'} ${inline}`;
      const nested = blocks
        ? `<section style="${S({
            margin: '0 0 8px',
            padding: '0 0 0 1.2em',
            textAlign: 'left',
            textIndent: '0',
          })}">${blocks}</section>`
        : '';
      return `<section style="${rowStyle}"><span style="color:${C.primary};font-weight:600">${marker}&#160;</span>${inline}</section>${nested}`;
    }).join('');
    return `<section style="${S({
      margin: '0 0 16px',
      padding: '0',
      textAlign: 'left',
      textIndent: '0',
    })}">${rows}</section>`;
  };

  renderer.table = function (token) {
    const colCount = token.header.length;
    const rowCount = token.rows.length + 1;
    const renderRow = (cells, rowIndex, header) => {
      const html = cells
        .map((cell, colIndex) => {
          cell._wxHeader = header;
          cell._wxLastCol = colIndex === colCount - 1;
          cell._wxLastRow = rowIndex === rowCount - 1;
          return this.tablecell(cell);
        })
        .join('');
      return `<tr>${html}</tr>`;
    };
    const header = renderRow(token.header, 0, true);
    const body = token.rows.map((row, index) => renderRow(row, index + 1, false)).join('');
    return `<section style="${S({
      margin: '12px 0 20px',
      overflow: 'hidden',
      border: `1px solid ${C.border}`,
      borderRadius: '6px',
    })}"><table style="${S({
      width: '100%',
      border: '0',
      borderCollapse: 'collapse',
      borderSpacing: '0',
      fontSize: '13px',
      lineHeight: '1.55',
      color: C.text,
    })}"><thead>${header}</thead><tbody>${body}</tbody></table></section>`;
  };

  renderer.tablerow = function ({ text }) {
    return `<tr>${text}</tr>`;
  };

  renderer.tablecell = function (token) {
    const content = this.parser.parseInline(token.tokens);
    const tag = token._wxHeader || token.header ? 'th' : 'td';
    const style = {
      border: '0',
      padding: '8px 10px',
      textAlign: token.align || 'left',
      verticalAlign: 'top',
      fontWeight: token._wxHeader || token.header ? '600' : '400',
      background: token._wxHeader || token.header ? C.tableHead : C.white,
      wordBreak: 'break-word',
      lineHeight: '1.55',
    };
    if (!token._wxLastCol) style.borderRight = `1px solid ${C.border}`;
    if (!token._wxLastRow) style.borderBottom = `1px solid ${C.border}`;
    // A leading text node keeps WeChat from splitting the cell after an inline tag.
    return `<${tag} style="${S(style)}">&#8203;${content}</${tag}>`;
  };

  renderer.strong = function ({ tokens }) {
    return `<strong style="font-weight:700;color:${C.text}">${this.parser.parseInline(tokens)}</strong>`;
  };

  renderer.em = function ({ tokens }) {
    return `<em>${this.parser.parseInline(tokens)}</em>`;
  };

  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const absolute = wechatHref(href);
    // In-page anchors, mailto, and other non-http hrefs are not links WeChat
    // will keep. Submitting them returns 64562. Site-root paths become the
    // public johng.cn URL; anything else that is not http(s) stays as text.
    if (!absolute) return text;
    const t = title ? ` title="${escapeHtml(title)}"` : '';
    return `<a href="${escapeHtml(absolute)}"${t} style="color:${C.primary};text-decoration:none;border-bottom:1px solid rgba(47,128,237,0.35)">${text}</a>`;
  };

  renderer.image = function ({ href, title, text }) {
    const src = ctx.images.get(href) || href;
    const mermaid = href.startsWith('__MERMAID_');
    const description = mermaid ? '示意图' : imageDescription(text);
    const titleText = mermaid ? '' : imageDescription(title || text || '');
    const alt = escapeHtml(description);
    const cap =
      !mermaid && description
        ? `<p style="${S({
            margin: '6px 0 0',
            fontSize: '13px',
            lineHeight: '1.5',
            color: C.subtle,
            textAlign: 'center',
          })}">${escapeHtml(description)}</p>`
        : '';
    return `<section style="margin:16px 0 20px;text-align:center"><img src="${escapeHtml(src)}" alt="${alt}" title="${escapeHtml(titleText)}" style="display:block;width:100%;max-width:100%;height:auto;border-radius:6px;margin:0 auto"/>${cap}</section>`;
  };

  renderer.hr = function () {
    return `<p style="margin:24px 0;border:0;border-top:1px solid ${C.border};height:0;line-height:0"> </p>\n`;
  };

  renderer.html = function ({ text }) {
    const trimmed = String(text).trim();
    if (/^<!--\s*truncate\s*-->$/.test(trimmed)) return '';
    const iframe = trimmed.match(/^<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/iframe>$/i);
    if (iframe) {
      const bv = iframe[1].match(/[?&]bvid=([A-Za-z0-9]+)/i);
      if (bv) {
        const href = `https://www.bilibili.com/video/${bv[1]}`;
        return `<p style="${S({
          margin: '0 0 16px',
          padding: '0',
          fontSize: '16px',
          lineHeight: '1.85',
          color: C.text,
          textAlign: 'left',
          textIndent: '0',
        })}">视频：<a href="${escapeHtml(href)}" style="color:${C.primary};text-decoration:none;border-bottom:1px solid rgba(47,128,237,0.35)">${escapeHtml(href)}</a></p>`;
      }
    }
    return text;
  };

  return renderer;
}

function wrapAdmonitions(html) {
  const open = /<!--ADMONITION:(\w+):([A-Za-z0-9+/=]+)-->/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = open.exec(html))) {
    out += html.slice(last, m.index);
    const kind = m[1];
    const title = Buffer.from(m[2], 'base64').toString('utf8');
    const end = html.indexOf('<!--/ADMONITION-->', m.index);
    const inner = html.slice(m.index + m[0].length, end);
    const isWarn = kind === 'warning';
    const color = isWarn ? C.warn : C.primary;
    const bg = isWarn ? C.warnBg : C.infoBg;
    const titleHtml = escapeHtml(title).replace(
      /`([^`]+)`/g,
      `<span style="display:inline;font-family:${MONO};font-size:90%;color:${C.code};background:${C.codeBg};padding:0 3px;border-radius:3px">$1</span>`,
    );
    out += `<section style="${S({
      margin: '16px 0 20px',
      padding: '12px 14px',
      background: bg,
      borderLeft: `4px solid ${color}`,
      borderRadius: '4px',
    })}"><p style="${S({
      margin: '0 0 8px',
      fontSize: '15px',
      fontWeight: '700',
      color: C.text,
    })}">${titleHtml}</p>${inner}</section>`;
    last = end + '<!--/ADMONITION-->'.length;
    open.lastIndex = last;
  }
  out += html.slice(last);
  return out;
}

function articleChrome({ url, body }) {
  const source = url
    ? `<p style="${S({
        margin: '28px 0 0',
        padding: '12px 0 0',
        borderTop: `1px solid ${C.border}`,
        fontSize: '13px',
        color: C.subtle,
        lineHeight: '1.6',
        textAlign: 'left',
        textIndent: '0',
      })}">原文：<a href="${escapeHtml(url)}" style="color:${C.primary};text-decoration:none">${escapeHtml(url)}</a></p>`
    : '';
  return compactForWechat(`<section style="${S({
    maxWidth: '677px',
    margin: '0 auto',
    color: C.text,
    fontSize: '16px',
    lineHeight: '1.85',
    fontFamily: FONT,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    textAlign: 'left',
    textIndent: '0',
  })}">${body}${source}</section>`);
}

function previewPage({ title, author, date, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>公众号预览 · ${escapeHtml(title)}</title>
  <style>
    html, body { margin: 0; padding: 0; background: #ededed; }
    body { font-family: ${FONT}; }
    .page { max-width: 480px; margin: 0 auto; padding: 24px 0 48px; }
    .phone { background: #fff; min-height: 100vh; box-shadow: 0 8px 32px rgba(0,0,0,.08); }
    .wx-bar { padding: 10px 16px; font-size: 13px; color: #888; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; }
    .wx-title { padding: 20px 16px 8px; font-size: 22px; font-weight: 700; color: #1a1a1a; line-height: 1.4; }
    .wx-meta { padding: 0 16px 16px; font-size: 14px; color: #576b95; }
    .wx-meta span { color: #888; margin-left: 8px; }
    .wx-body { padding: 0 16px 32px; }
    .badge { display: inline-block; margin: 0 16px 12px; padding: 2px 8px; font-size: 12px; color: #b8822e; background: #fff7e6; border-radius: 4px; }
    .hint { max-width: 480px; margin: 0 auto 12px; padding: 0 8px; font-size: 13px; color: #666; }
  </style>
</head>
<body>
  <div class="page">
    <p class="hint">本地预览 · 未发布到公众号。打开本文件即可查看排版；正文 HTML 在同目录 <code>wechat-body.html</code>。</p>
    <div class="phone">
      <div class="wx-bar"><span>John's Blog</span><span>预览草稿</span></div>
      <div class="badge">未发布</div>
      <h1 class="wx-title">${escapeHtml(title)}</h1>
      <div class="wx-meta">${escapeHtml(author)}<span>${escapeHtml(date)}</span></div>
      <div class="wx-body">${bodyHtml}</div>
    </div>
  </div>
</body>
</html>`;
}

function clipDigest(text) {
  const raw = String(text || '').trim();
  if (raw.length <= 120) return raw;
  const cut = raw.slice(0, 120);
  const punct = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('！'), cut.lastIndexOf('？'));
  if (punct >= 40) return cut.slice(0, punct + 1);
  return cut;
}

async function main() {
  const mdArg = process.argv[2];
  if (!mdArg) {
    console.error(
      'usage: node .agents/skills/wechat-draft/scripts/generate.mjs <markdown-path>',
    );
    process.exit(2);
  }
  const mdPath = path.resolve(mdArg);
  const raw = await readFile(mdPath, 'utf8');
  const { meta, body: rawBody } = parseFrontmatter(raw);
  const title = meta.title || path.basename(mdPath, '.md');
  const slug = (meta.slug || 'article').replace(/[^a-z0-9-]/gi, '-');
  const slugPath = (meta.slug || '').replace(/^\//, '');
  const rel = path.relative(ROOT, mdPath);
  const isBlog = rel === 'blog' || rel.startsWith(`blog${path.sep}`);
  const publicPath =
    !slugPath ? '' : isBlog && !slugPath.startsWith('blog/') ? `blog/${slugPath}` : slugPath;
  const url = publicPath ? `https://johng.cn/${publicPath}` : '';
  const outDir = path.join(SKILL_ROOT, 'preview', slug);
  const imgDir = path.join(outDir, 'images');
  await mkdir(imgDir, { recursive: true });

  const mdDir = path.dirname(mdPath);
  let body = stripMdxNowrapSpans(rawBody);
  const { body: withPlaceholders, blocks } = extractMermaid(body);
  body = extractAdmonitions(withPlaceholders);

  const images = new Map();
  const imgRe = /!\[[^\]]*]\(([^)]+)\)/g;
  let im;
  const localImgs = [];
  while ((im = imgRe.exec(body))) {
    const href = im[1].replace(/^<|>$/g, '');
    if (href.startsWith('__MERMAID_')) continue;
    localImgs.push(href);
  }

  for (const href of [...new Set(localImgs)]) {
    const abs = resolveAsset(mdDir, href);
    if (!existsSync(abs)) {
      console.warn('missing image', href);
      continue;
    }
    const base = path.basename(href, path.extname(href)).replace(/\s+/g, '-');
    const outName = `${base}.jpg`;
    const dest = path.join(imgDir, outName);
    await convertRaster(abs, dest);
    images.set(href, `images/${outName}`);
    console.log('image', href, '->', outName);
  }

  for (let i = 0; i < blocks.length; i++) {
    const outName = `mermaid-${String(i + 1).padStart(2, '0')}.png`;
    const dest = path.join(imgDir, outName);
    process.stdout.write(`mermaid ${i + 1}/${blocks.length} ... `);
    try {
      console.log(await mermaidToPng(blocks[i], dest));
    } catch (err) {
      console.log('fail', err.message);
      const fallback = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="120"><rect width="100%" height="100%" fill="#f4f6f8"/><text x="24" y="68" fill="#172b4d" font-size="20">示意图 ${i + 1} 渲染失败，请查看原文</text></svg>`;
      await sharp(Buffer.from(fallback)).png().toFile(dest);
    }
    images.set(`__MERMAID_${i}__`, `images/${outName}`);
  }

  const firstHref = firstFigureHref(body);
  if (!firstHref) {
    throw new Error('文章没有可用的首图，不能做公众号封面');
  }
  let coverSrc = '';
  if (firstHref.startsWith('__MERMAID_')) {
    const rel = images.get(firstHref);
    if (!rel) throw new Error(`首图未生成: ${firstHref}`);
    coverSrc = path.join(outDir, rel);
  } else {
    const abs = resolveAsset(mdDir, firstHref);
    const dedicated = abs && existsSync(path.dirname(abs))
      ? ['cover.webp', 'cover.jpg', 'cover.png']
          .map((name) => path.join(path.dirname(abs), name))
          .find((p) => existsSync(p))
      : '';
    if (dedicated) coverSrc = dedicated;
    else if (existsSync(abs)) coverSrc = abs;
    else if (images.get(firstHref)) coverSrc = path.join(outDir, images.get(firstHref));
    else throw new Error(`找不到文章首图: ${firstHref}`);
  }
  const coverPath = path.join(imgDir, 'cover-235.jpg');
  console.log('cover source', path.relative(ROOT, coverSrc));
  await composeCover(coverSrc, coverPath);

  const ctx = { images };
  // GFM treats a leading run of ` or ~ as plain text. In `甲`~`乙` the second
  // opener is swallowed, later backticks pair with the wrong closer, and the
  // leftovers show up as ` in the article. Split that ~ off before codespan.
  const tildeBeforeCode = {
    name: 'tildeBeforeCode',
    level: 'inline',
    start(src) {
      const index = src.search(/~+(?=`)/);
      return index === -1 ? undefined : index;
    },
    tokenizer(src) {
      const match = /^~+(?=`)/.exec(src);
      if (!match) return;
      return { type: 'text', raw: match[0], text: match[0] };
    },
  };
  marked.use({
    gfm: true,
    breaks: false,
    extensions: [tildeBeforeCode],
    renderer: buildRenderer(ctx),
  });
  let html = marked.parse(body);
  html = wrapAdmonitions(html);

  const bodyHtml = articleChrome({
    url,
    body: html,
  });

  const digest = clipDigest(meta.description || title);
  const prevMetaPath = path.join(outDir, 'meta.json');
  let prevDraft = undefined;
  if (existsSync(prevMetaPath)) {
    try {
      prevDraft = JSON.parse(await readFile(prevMetaPath, 'utf8')).draft;
    } catch {
      prevDraft = undefined;
    }
  }
  const coverFile = 'images/cover-235.jpg';
  const metaJson = {
    title,
    author: 'John Guo',
    digest,
    url,
    cover: coverFile,
    published: false,
    sourceMarkdown: path.relative(ROOT, mdPath),
  };
  if (prevDraft) metaJson.draft = prevDraft;

  await writeFile(path.join(outDir, 'wechat-body.html'), bodyHtml, 'utf8');
  await writeFile(
    path.join(outDir, 'preview.html'),
    previewPage({
      title,
      author: 'John Guo',
      date: new Date().toISOString().slice(0, 10),
      bodyHtml,
    }),
    'utf8',
  );
  await writeFile(path.join(outDir, 'meta.json'), JSON.stringify(metaJson, null, 2), 'utf8');
  console.log('wrote', outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
