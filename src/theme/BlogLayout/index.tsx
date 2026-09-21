import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import type {Props} from '@theme/BlogLayout';
import {
  DesktopTOCPanel,
  DesktopTOCReopenButton,
  tocColClassName,
  useDesktopTocCollapsed,
} from '../TOC/DesktopCollapse';
import SidebarToggleButton from '../SidebarToggleButton';

import styles from './styles.module.css';

let persistedBlogSidebarCollapsed = false;

function useBlogSidebarCollapsed(): [boolean, () => void] {
  const [collapsed, setCollapsed] = useState(persistedBlogSidebarCollapsed);
  const toggle = useCallback(() => {
    setCollapsed((value) => {
      const next = !value;
      persistedBlogSidebarCollapsed = next;
      return next;
    });
  }, []);
  return [collapsed, toggle];
}

export default function BlogLayout(props: Props): JSX.Element {
  const {sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  const {collapsed: tocCollapsed, collapse, expand} = useDesktopTocCollapsed();
  const [sidebarCollapsed, toggleSidebar] = useBlogSidebarCollapsed();
  const hadToc = Boolean(toc);
  const showToc = hadToc && !tocCollapsed;
  const showLeftSidebar = hasSidebar && !sidebarCollapsed;

  return (
    <Layout {...layoutProps}>
      <div
        className={clsx(
          'container margin-vert--lg',
          styles.container,
          hasSidebar && sidebarCollapsed && styles.containerEnhanced,
        )}>
        <div className="row">
          {hasSidebar && (
            <div
              className={clsx(
                styles.sidebarSlot,
                sidebarCollapsed && styles.sidebarSlotHidden,
              )}>
              <div className={styles.toggleRail}>
                <SidebarToggleButton
                  collapsed={sidebarCollapsed}
                  onClick={toggleSidebar}
                  ariaControls="blog-sidebar"
                />
              </div>
              <div
                id="blog-sidebar"
                className={styles.sidebarViewport}
                aria-hidden={sidebarCollapsed}>
                <BlogSidebar sidebar={sidebar} />
              </div>
            </div>
          )}
          <main
            className={clsx(
              'col',
              {
                'col--7': showLeftSidebar && (showToc || !hadToc),
                'col--9': showLeftSidebar && hadToc && tocCollapsed,
                'col--10': hasSidebar && sidebarCollapsed && showToc,
                'col--12': hasSidebar && sidebarCollapsed && !showToc,
                'col--9 col--offset-1': !hasSidebar && (showToc || !hadToc),
              },
              hadToc && tocCollapsed && styles.mainWithReopen,
            )}>
            {hadToc && tocCollapsed && (
              <DesktopTOCReopenButton onExpand={expand} />
            )}
            {children}
          </main>
          {showToc && (
            <div className={clsx('col col--2', tocColClassName)}>
              <DesktopTOCPanel onCollapse={collapse}>{toc}</DesktopTOCPanel>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
