const {execFileSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const COMMIT_LINE = /^---(\d{4}-\d{2}-\d{2}T[^\t]*)\t(.*)$/;
const SNAPSHOT_SUBJECT = 'reinit';

function shanghaiDay(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  // en-CA yields YYYY-MM-DD. Commit timestamps are converted to the site's zone
  // so a late-night UTC commit does not land on the previous calendar day.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function isArticlePath(filePath) {
  return filePath.endsWith('.md') || filePath.endsWith('.mdx');
}

/**
 * `git log --name-status` is newest-first. Renames are followed so a moved
 * article keeps the dates of its earlier path. A pure rename (R100) does not
 * count as a content edit.
 *
 * The 2026-09-18 `reinit` commit replaced earlier history, so that commit is not
 * a real publish or edit date.
 */
function parseGitLog(output) {
  const dates = {};
  const ids = {};
  let current;

  function fileId(filePath) {
    return ids[filePath] || filePath;
  }

  function touch(filePath) {
    if (!current || !isArticlePath(filePath)) {
      return;
    }
    const id = fileId(filePath);
    ids[filePath] = id;
    const existing = dates[id];
    if (!existing) {
      dates[id] = {
        updated: current.day,
        published: current.day,
        snapshot: current.snapshot,
        bornInSnapshot: current.snapshot,
      };
      return;
    }
    existing.published = current.day;
    existing.bornInSnapshot = current.snapshot;
  }

  function linkRename(oldPath, newPath) {
    if (!isArticlePath(oldPath) && !isArticlePath(newPath)) {
      return;
    }
    const id = fileId(newPath);
    ids[newPath] = id;
    ids[oldPath] = id;
  }

  for (const rawLine of output.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    if (!line) {
      continue;
    }
    const commit = COMMIT_LINE.exec(line);
    if (commit) {
      const day = shanghaiDay(commit[1]);
      current = day
        ? {day, snapshot: commit[2].trim() === SNAPSHOT_SUBJECT}
        : undefined;
      continue;
    }
    if (!current) {
      continue;
    }
    const tab = line.indexOf('\t');
    if (tab <= 0) {
      continue;
    }
    const status = line.slice(0, tab);
    const rest = line.slice(tab + 1);
    const code = status[0];
    if (code === 'R' || code === 'C') {
      const split = rest.indexOf('\t');
      if (split === -1) {
        continue;
      }
      const oldPath = rest.slice(0, split);
      const newPath = rest.slice(split + 1);
      const identical = status.slice(1) === '100';
      // A copy starts a new article. A rename continues the same article.
      if (code === 'C') {
        touch(newPath);
        continue;
      }
      if (!identical) {
        touch(newPath);
      }
      linkRename(oldPath, newPath);
      continue;
    }
    if (code === 'M' || code === 'A' || code === 'T') {
      touch(rest);
    }
  }

  return dates;
}

function stripFrontMatter(content) {
  const normalized = content.replace(/^\uFEFF/, '');
  if (!normalized.startsWith('---')) {
    return normalized;
  }
  const end = normalized.indexOf('\n---', 3);
  if (end === -1) {
    return normalized;
  }
  return normalized.slice(end + 4).replace(/^\r?\n/, '');
}

/**
 * A category landing is only a DocCardList. An article that also embeds a
 * card list still has its own body, so it keeps the date chip.
 */
function isCategoryListMarkdown(content) {
  const body = stripFrontMatter(content).replace(/\r\n/g, '\n').trim();
  const withoutImport = body.replace(
    /^import\s+DocCardList\s+from\s+['"]@theme\/DocCardList['"];?[ \t]*(?:\n|$)/,
    '',
  );
  if (withoutImport === body) {
    return false;
  }
  const rest = withoutImport.trim();
  if (!rest) {
    return false;
  }
  const card =
    '<DocCardList(?:\\s[^<>]*)?\\s*/>|<DocCardList(?:\\s[^<>]*)?\\s*>\\s*</DocCardList>';
  return new RegExp(`^(?:${card})(?:\\s*(?:${card}))*$`).test(rest);
}

function walkMarkdown(dir, files) {
  let entries;
  try {
    entries = fs.readdirSync(dir, {withFileTypes: true});
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMarkdown(full, files);
      continue;
    }
    if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function findCategoryListPages(siteDir) {
  const listPages = {};
  for (const file of walkMarkdown(path.join(siteDir, 'docs'), [])) {
    const content = fs.readFileSync(file, 'utf8');
    if (!isCategoryListMarkdown(content)) {
      continue;
    }
    const rel = path.relative(siteDir, file).split(path.sep).join('/');
    listPages[rel] = true;
  }
  return listPages;
}

function loadArticleDates(siteDir) {
  try {
    const output = execFileSync(
      'git',
      [
        '-c',
        'core.quotepath=false',
        'log',
        '--name-status',
        '--pretty=format:---%cI%x09%s',
        '--',
        'docs',
        'blog',
      ],
      {
        cwd: siteDir,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
      },
    );
    return parseGitLog(output);
  } catch (error) {
    console.warn(
      `[article-dates] 无法从 Git 读取文章日期：${
        error instanceof Error ? error.message : error
      }`,
    );
    return {};
  }
}

function articleDatesPlugin(context) {
  return {
    name: 'article-dates',
    getPathsToWatch() {
      return [path.join(context.siteDir, 'src/plugins/article-dates.js')];
    },
    async loadContent() {
      return {
        dates: loadArticleDates(context.siteDir),
        listPages: findCategoryListPages(context.siteDir),
      };
    },
    async contentLoaded({content, actions}) {
      actions.setGlobalData(content);
    },
  };
}

module.exports = articleDatesPlugin;
module.exports.parseGitLog = parseGitLog;
module.exports.shanghaiDay = shanghaiDay;
module.exports.isCategoryListMarkdown = isCategoryListMarkdown;
module.exports.findCategoryListPages = findCategoryListPages;
