import React, {type ReactNode, useState, useCallback} from 'react';
import clsx from 'clsx';
import {prefersReducedMotion, ThemeClassNames} from '@docusaurus/theme-common';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import DocSidebar from '@theme/DocSidebar';
import type {Props} from '@theme/DocRoot/Layout/Sidebar';

import SidebarToggleButton from './ToggleButton';
import styles from './styles.module.css';

function ResetOnSidebarChange({children}: {children: ReactNode}) {
  const sidebar = useDocsSidebar();
  return (
    <React.Fragment key={sidebar?.name ?? 'noSidebar'}>
      {children}
    </React.Fragment>
  );
}

export default function DocRootLayoutSidebar({
  sidebar,
  hiddenSidebarContainer,
  setHiddenSidebarContainer,
}: Props): JSX.Element {
  const {pathname} = useLocation();
  const [hiddenSidebar, setHiddenSidebar] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }
    if (!hiddenSidebar && prefersReducedMotion()) {
      setHiddenSidebar(true);
    }
    setHiddenSidebarContainer((value) => !value);
  }, [setHiddenSidebarContainer, hiddenSidebar]);

  return (
    <div className={styles.sidebarSlot}>
      <div className={styles.toggleRail}>
        <SidebarToggleButton
          collapsed={hiddenSidebarContainer}
          onClick={toggleSidebar}
        />
      </div>
      <aside
        id="docs-sidebar"
        className={clsx(
          ThemeClassNames.docs.docSidebarContainer,
          styles.docSidebarContainer,
          hiddenSidebarContainer && styles.docSidebarContainerHidden,
        )}
        onTransitionEnd={(e) => {
          if (!e.currentTarget.classList.contains(styles.docSidebarContainer!)) {
            return;
          }
          if (e.propertyName !== 'width') {
            return;
          }
          if (hiddenSidebarContainer) {
            setHiddenSidebar(true);
          }
        }}>
        <ResetOnSidebarChange>
          <div className={styles.sidebarViewport}>
            <DocSidebar
              sidebar={sidebar}
              path={pathname}
              onCollapse={toggleSidebar}
              isHidden={hiddenSidebar}
            />
          </div>
        </ResetOnSidebarChange>
      </aside>
    </div>
  );
}
