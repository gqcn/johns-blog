import React from 'react';
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

import styles from './styles.module.css';

export default function BlogLayout(props: Props): JSX.Element {
  const {sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  const {collapsed: tocCollapsed, collapse, expand} = useDesktopTocCollapsed();
  const hadToc = Boolean(toc);
  const showToc = hadToc && !tocCollapsed;

  return (
    <Layout {...layoutProps}>
      <div
        className={clsx(
          'container margin-vert--lg',
          hadToc && styles.containerWide,
        )}>
        <div className={clsx('row', styles.row)}>
          {hasSidebar && (
            <div className={styles.sidebarSlot}>
              <div id="blog-sidebar" className={styles.sidebarViewport}>
                <BlogSidebar sidebar={sidebar} />
              </div>
            </div>
          )}
          <main
            className={clsx(
              'col',
              {
                'col--7': hasSidebar && (showToc || !hadToc),
                'col--9': hasSidebar && hadToc && tocCollapsed,
                'col--9 col--offset-1': !hasSidebar && (showToc || !hadToc),
              },
              hadToc && tocCollapsed && styles.mainWithReopen,
              hadToc && styles.mainFluid,
              hadToc && tocCollapsed && styles.mainTocCollapsed,
            )}>
            {hadToc && tocCollapsed && (
              <DesktopTOCReopenButton onExpand={expand} />
            )}
            {children}
          </main>
          {showToc && (
            <div className={clsx('col col--2', tocColClassName, styles.tocSlot)}>
              <DesktopTOCPanel onCollapse={collapse}>{toc}</DesktopTOCPanel>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
