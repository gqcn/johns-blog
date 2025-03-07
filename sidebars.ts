import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [{
      type: 'autogenerated',
      dirName: 'docs'
    }
  ],
  hiddenSidebar: [{
    type: 'autogenerated',
    dirName: 'hidden'
  }]
};

export default sidebars;
