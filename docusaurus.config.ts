
import type { Options as IdealImageOptions } from '@docusaurus/plugin-ideal-image';
import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter
// https://docusaurus.io/zh-CN/docs/api/docusaurus-config
const config: Config = {
  title: "John's Blog",
  tagline: "John's Blog",
  favicon: '/img/favicon.ico',
  url: 'https://johng.cn/',
  baseUrl: '/',
  trailingSlash: false,
  organizationName: '',
  projectName: '',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  // https://www.docusaurus.cn/blog/releases/3.6#docusaurus-faster
  future: {
    experimental_faster: true,
  },
  // 启用 Markdown 中的 Mermaid 支持
  markdown: {
    mermaid: true,
  },
  presets: [
    [
      'classic',
      {
        // Will be passed to @docusaurus/plugin-content-docs (false to disable)
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
          lastVersion: 'current'
        },
        // Will be passed to @docusaurus/plugin-content-blog (false to disable)
        blog: {},
        // Will be passed to @docusaurus/plugin-content-pages (false to disable)
        pages: {},
        // Will be passed to @docusaurus/theme-classic.
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        // Sitemap configuration for better SEO
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/hidden/**', '/tags/**', '/search', '/blog/tags/**', '/blog/authors', '/blog/archive'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],
  // 添加 Mermaid 主题
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [
    require.resolve('docusaurus-plugin-image-zoom'),
    [
      'ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        // Use false to debug, but it incurs huge perf costs
        disableInDev: true,
      } satisfies IdealImageOptions,
    ],
    // WeChat share plugin - inject hidden image for WeChat crawler
    './plugins/wechat-share-plugin.js',
  ],
  themeConfig: {
    metadata: [
      {
        name: 'keywords',
        content: 'AI技术,GPU虚拟化,Volcano,Kubernetes,云原生,GoFrame,Golang,微服务架构,分布式系统,容器技术,可观测性,Prometheus,链路跟踪,OpenTelemetry,数据库,中间件,技术博客',
      },
      {
        name: 'description',
        content: 'John\'s Blog - 专注AI技术、云原生技术、Kubernetes、Volcano、Go开发的技术博客。分享分布式系统、GPU虚拟化、微服务架构等实战经验与深度技术文章。',
      },
      {
        name: 'author',
        content: 'John Guo',
      },
      {
        property: 'og:image',
        content: 'https://johng.cn/img/favicon.png'
      }
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    zoom: {
      selector: '.markdown :not(em) > img',
      config: {
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)',
        },
      },
    },
    navbar: {
      title: "John's Blog",
      // logo: { },
      items: [

        {
          position: 'left',
          label: 'AI技术',
          to: '/ai',
        },
        {
          position: 'left',
          label: '云原生',
          to: '/cloud-native',
        },
        {
          position: 'left',
          label: '日常笔记',
          to: '/notes',
        },
        {
          position: 'left',
          label: '开发语言',
          to: '/programming',
        },
        {
          position: 'left',
          label: '技术架构',
          to: '/architecture',
        },
        {
          position: 'left',
          label: '可观测性',
          to: '/observability',
        },
        {
          position: 'left',
          label: '数据库与中间件',
          to: '/database-and-middleware',
        },
        {
          position: 'left',
          label: '生活笔记',
          to: '/life',
        },
        {
          position: 'left',
          label: '关于我',
          to: '/aboutme',
        },
        {
          position: 'right',
          label: '博客',
          to: '/blog',
        },

        {
          href: 'https://goframe.org/',
          position: 'right',
          className: 'header-goframe-link',
        },
        {
          href: 'https://github.com/gqcn',
          position: 'right',
          className: 'header-github-link',
        },
      ],
    },
    // toc目录层级显示设置
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    footer: {
      copyright: `Copyright ${new Date().getFullYear()} johng.cn`,
    },
    // 代码块配置
    prism: {
      theme: prismThemes.okaidia,
      darkTheme: prismThemes.dracula,
      defaultLanguage: 'go',
      additionalLanguages: ['bash', 'javascript', 'toml', 'ini', 'yaml', 'makefile', 'java', 'c'], // 添加语言
      // 默认支持的语言 https://github.com/FormidableLabs/prism-react-renderer/blob/master/packages/generate-prism-languages/index.ts#L9-L23
      // 默认支持的语言 "markup","jsx","tsx","swift","kotlin","objectivec","js-extras","reason","rust","graphql","yaml","go","cpp","markdown","python","json"
    },
    // 搜索配置
    algolia: {
      // The application ID provided by Algolia
      appId: 'XGS1CPQERK',

      // Public API key: it is safe to commit it
      apiKey: '4b3972b5af1d9371cb020b1a79cdccb4',

      indexName: 'johng',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,
    },
  } satisfies Preset.ThemeConfig,
  scripts: [
    {
      src: 'https://hm.baidu.com/hm.js?6b4ae23dc83ee5efe875b7172af6c7c1',
      async: true,
    },
  ],
};

export default config;
