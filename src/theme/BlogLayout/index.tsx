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
  const {collapsed, collapse, expand} = useDesktopTocCollapsed();
  const hadToc = Boolean(toc);
  const showToc = hadToc && !collapsed;

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          <BlogSidebar sidebar={sidebar} />
          <main
            className={clsx(
              'col',
              {
                'col--7': hasSidebar && (showToc || !hadToc),
                'col--9': hasSidebar && hadToc && collapsed,
                'col--9 col--offset-1': !hasSidebar && (showToc || !hadToc),
              },
              hadToc && collapsed && styles.mainWithReopen,
            )}>
            {hadToc && collapsed && (
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
