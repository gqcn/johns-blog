import fs from 'fs';
import path from 'path';

/**
 * `docs/docs/1000-AI技术/800-基础架构/350-基础组件` holds link notes only.
 * Each note points at an existing article. The docs plugin excludes this
 * directory, and this generator turns those notes into sidebar `ref` items
 * so a click opens the original document.
 */
const LINK_DIR_PARTS = [
  'docs',
  '1000-AI技术',
  '800-基础架构',
  '350-基础组件',
];

type NumberPrefixParser = (filename: string) => {
  filename: string;
  numberPrefix?: number;
};

type DocRef = {
  id: string;
  source: string;
  sourceDirName: string;
};

type SidebarItem = {
  type: string;
  id?: string;
  label?: string;
  items?: SidebarItem[];
};

type GeneratorArgs = {
  defaultSidebarItemsGenerator: (
    args: Omit<GeneratorArgs, 'defaultSidebarItemsGenerator'>,
  ) => Promise<SidebarItem[]> | SidebarItem[];
  item: {dirName: string};
  numberPrefixParser: NumberPrefixParser;
  docs: DocRef[];
  version: {contentPath: string};
};

type LinkNote = {
  source: string;
  position?: number;
  label: string;
  docId: string;
};

function toPosix(filePath: string): string {
  return filePath.split(path.sep).join('/').normalize('NFC');
}

function stripMarkdownExtension(fileName: string): string {
  return fileName.replace(/\.(md|mdx)$/i, '');
}

function parseTitle(frontMatter: string): string | undefined {
  for (const line of frontMatter.split('\n')) {
    const match = line.match(/^title:\s*(.*?)\s*$/);
    if (!match) {
      continue;
    }
    return match[1].replace(/^["']|["']$/g, '').trim();
  }
  return undefined;
}

function firstMarkdownLink(markdown: string): string | undefined {
  const match = markdown.match(
    /\[[^\]]*]\(\s*(<[^>]+>|[^)\s]+)\s*\)/,
  );
  if (!match) {
    return undefined;
  }
  const raw = match[1].startsWith('<')
    ? match[1].slice(1, -1)
    : match[1];
  return decodeURIComponent(raw.trim());
}

function docRelativePath(doc: DocRef): string {
  return toPosix(path.posix.join(doc.sourceDirName, path.basename(doc.source)));
}

function findDocId(
  docs: readonly DocRef[],
  contentPath: string,
  linkFilePath: string,
  target: string,
): string {
  const absoluteTarget = fs.realpathSync(
    path.resolve(path.dirname(linkFilePath), target),
  );
  const relativeTarget = toPosix(path.relative(contentPath, absoluteTarget));
  const matches = docs.filter((doc) => docRelativePath(doc) === relativeTarget);
  if (matches.length === 1) {
    return matches[0].id;
  }
  const note = path.basename(linkFilePath);
  if (matches.length === 0) {
    throw new Error(
      `基础组件链接 ${note} 指向的文档不存在或未纳入站点：${target}`,
    );
  }
  throw new Error(
    `基础组件链接 ${note} 匹配到多篇文档：${matches
      .map((doc) => doc.id)
      .join(', ')}`,
  );
}

function readLinkNotes(
  linkDir: string,
  docs: readonly DocRef[],
  contentPath: string,
  numberPrefixParser: NumberPrefixParser,
): LinkNote[] {
  const fileNames = fs
    .readdirSync(linkDir)
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .sort();
  return fileNames.map((fileName) => {
    const filePath = path.join(linkDir, fileName);
    const content = fs.readFileSync(filePath, 'utf8');
    const frontMatterEnd = content.startsWith('---\n')
      ? content.indexOf('\n---', 4)
      : -1;
    const frontMatter =
      frontMatterEnd >= 0 ? content.slice(4, frontMatterEnd) : '';
    const body =
      frontMatterEnd >= 0 ? content.slice(frontMatterEnd + 4) : content;
    const parsedName = numberPrefixParser(stripMarkdownExtension(fileName));
    const title = parseTitle(frontMatter);
    const target = firstMarkdownLink(body);
    if (!target) {
      throw new Error(`基础组件链接 ${fileName} 缺少指向详情文档的 Markdown 链接。`);
    }
    return {
      source: fileName,
      position: parsedName.numberPrefix,
      label: title || parsedName.filename,
      docId: findDocId(docs, contentPath, filePath, target),
    };
  });
}

function itemKey(item: SidebarItem): string | undefined {
  if (item.type === 'category') {
    return item.label;
  }
  if ((item.type === 'doc' || item.type === 'ref') && 'id' in item && item.id) {
    return item.id.split('/').pop();
  }
  return undefined;
}

function sortByPosition<T extends {position?: number; source: string}>(
  items: T[],
): T[] {
  return [...items].sort((left, right) => {
    const leftPosition = left.position ?? Number.POSITIVE_INFINITY;
    const rightPosition = right.position ?? Number.POSITIVE_INFINITY;
    if (leftPosition !== rightPosition) {
      return leftPosition - rightPosition;
    }
    if (left.source < right.source) {
      return -1;
    }
    if (left.source > right.source) {
      return 1;
    }
    return 0;
  });
}

function insertComponentCategory(
  items: SidebarItem[],
  infraDir: string,
  category: SidebarItem,
  numberPrefixParser: NumberPrefixParser,
): SidebarItem[] {
  const byKey = new Map<string, SidebarItem>();
  items.forEach((item) => {
    const key = itemKey(item);
    if (key) {
      byKey.set(key, item);
    }
  });

  const ranked = fs.readdirSync(infraDir).flatMap((name) => {
    if (name.startsWith('.')) {
      return [];
    }
    const key =
      name === '350-基础组件'
        ? '基础组件'
        : numberPrefixParser(stripMarkdownExtension(name)).filename;
    if (name !== '350-基础组件' && !byKey.has(key)) {
      return [];
    }
    const parsed = numberPrefixParser(stripMarkdownExtension(name));
    return [
      {
        name,
        key,
        position: parsed.numberPrefix,
        source: name,
      },
    ];
  });

  const ordered = sortByPosition(ranked);
  const used = new Set<string>();
  const nextItems = ordered.map((entry) => {
    if (entry.name === '350-基础组件') {
      used.add(entry.key);
      return category;
    }
    const item = byKey.get(entry.key);
    if (!item) {
      throw new Error(`基础架构侧边栏缺少与目录 ${entry.name} 对应的条目。`);
    }
    used.add(entry.key);
    return item;
  });

  items.forEach((item) => {
    const key = itemKey(item);
    if (key && !used.has(key)) {
      throw new Error(`基础架构目录中没有与侧边栏条目 ${key} 对应的文件或文件夹。`);
    }
  });
  return nextItems;
}

function replaceInfraCategory(
  items: SidebarItem[],
  infraDir: string,
  category: SidebarItem,
  numberPrefixParser: NumberPrefixParser,
): {items: SidebarItem[]; replaced: boolean} {
  let replaced = false;
  const nextItems = items.map((item) => {
    if (item.type !== 'category' || !item.items) {
      return item;
    }
    const nested = replaceInfraCategory(
      item.items,
      infraDir,
      category,
      numberPrefixParser,
    );
    const isInfra =
      item.label === '基础架构' &&
      item.items.some((child) => itemKey(child) === 'NVIDIA') &&
      item.items.some((child) => itemKey(child) === 'RDMA');
    if (isInfra) {
      replaced = true;
      return {
        ...item,
        items: insertComponentCategory(
          item.items,
          infraDir,
          category,
          numberPrefixParser,
        ),
      };
    }
    if (nested.replaced) {
      replaced = true;
      return {...item, items: nested.items};
    }
    return item;
  });
  return {items: nextItems, replaced};
}

export async function sidebarItemsGenerator({
  defaultSidebarItemsGenerator,
  ...args
}: GeneratorArgs): Promise<SidebarItem[]> {
  const sidebar = await defaultSidebarItemsGenerator(args);
  if (args.item.dirName !== 'docs') {
    return sidebar;
  }

  const contentPath = args.version.contentPath;
  const linkDir = path.join(contentPath, ...LINK_DIR_PARTS);
  if (!fs.existsSync(linkDir)) {
    return sidebar;
  }

  const notes = sortByPosition(
    readLinkNotes(linkDir, args.docs, contentPath, args.numberPrefixParser),
  );
  if (notes.length === 0) {
    return sidebar;
  }

  const category: SidebarItem = {
    type: 'category',
    label: '基础组件',
    items: notes.map((note) => ({
      type: 'ref',
      id: note.docId,
      label: note.label,
    })),
  };
  const infraDir = path.dirname(linkDir);
  const replaced = replaceInfraCategory(
    sidebar,
    infraDir,
    category,
    args.numberPrefixParser,
  );
  if (!replaced.replaced) {
    throw new Error('未在自动生成的侧边栏中找到「基础架构」分类，基础组件链接无法挂入。');
  }
  return replaced.items;
}
