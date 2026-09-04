import React from 'react';
import {translate} from '@docusaurus/Translate';
import {ChevronsLeft} from 'lucide-react';

import styles from './styles.module.css';

export default function SidebarToggleButton({
  collapsed,
  onClick,
}: {
  collapsed: boolean;
  onClick: () => void;
}): JSX.Element {
  const label = collapsed
    ? translate({
        id: 'theme.docs.sidebar.expandButtonTitle',
        message: '展开左侧栏目',
        description: 'The title attribute for the docs sidebar expand button',
      })
    : translate({
        id: 'theme.docs.sidebar.collapseButtonTitle',
        message: '收起左侧栏目',
        description: 'The title attribute for the docs sidebar collapse button',
      });

  return (
    <button
      type="button"
      className={`${styles.toggleButton} ${
        collapsed ? styles.toggleButtonCollapsed : ''
      }`}
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-controls="docs-sidebar"
      aria-expanded={!collapsed}>
      <ChevronsLeft size={15} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
