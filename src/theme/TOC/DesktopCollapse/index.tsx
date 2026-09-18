import React, {useCallback, useEffect, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import {translate} from '@docusaurus/Translate';
import {ChevronsRight, List} from 'lucide-react';

import styles from './styles.module.css';

export function useDesktopTocCollapsed(): {
  collapsed: boolean;
  collapse: () => void;
  expand: () => void;
} {
  const [collapsed, setCollapsed] = useState(false);
  const {pathname} = useLocation();

  useEffect(() => {
    setCollapsed(false);
  }, [pathname]);

  const collapse = useCallback(() => setCollapsed(true), []);
  const expand = useCallback(() => setCollapsed(false), []);

  return {collapsed, collapse, expand};
}

export const tocColClassName = styles.tocCol;

export function DesktopTOCPanel({
  children,
  onCollapse,
}: {
  children: React.ReactNode;
  onCollapse: () => void;
}): JSX.Element {
  const collapseLabel = translate({
    id: 'theme.TOC.collapseButtonTitle',
    message: '收起本页目录',
    description: 'Title for the desktop TOC collapse button',
  });

  return (
    <nav
      className={styles.panel}
      aria-label={translate({
        id: 'theme.TOC.panelAriaLabel',
        message: '本页目录',
        description: 'ARIA label for the desktop TOC panel',
      })}>
      <button
        type="button"
        className={`clean-btn ${styles.collapseButton}`}
        onClick={onCollapse}
        title={collapseLabel}
        aria-label={collapseLabel}
        aria-expanded="true">
        <ChevronsRight size={16} strokeWidth={2} aria-hidden="true" />
      </button>
      <div className={`${styles.body} thin-scrollbar`}>{children}</div>
    </nav>
  );
}

export function DesktopTOCReopenButton({
  onExpand,
}: {
  onExpand: () => void;
}): JSX.Element {
  const expandLabel = translate({
    id: 'theme.TOC.expandButtonTitle',
    message: '展开本页目录',
    description: 'Title for the floating desktop TOC expand button',
  });

  return (
    <div className={styles.reopenAnchor}>
      <button
        type="button"
        className={styles.reopenButton}
        onClick={onExpand}
        title={expandLabel}
        aria-label={expandLabel}
        aria-expanded="false">
        <List size={14} strokeWidth={2} aria-hidden="true" />
        <span>
          {translate({
            id: 'theme.TOC.expandButtonLabel',
            message: '目录',
            description: 'Label on the floating desktop TOC expand button',
          })}
        </span>
      </button>
    </div>
  );
}
