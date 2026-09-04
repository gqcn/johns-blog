import React from 'react';
import clsx from 'clsx';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import type {Props} from '@theme/DocItem/Layout';
import {
  DesktopTOCPanel,
  DesktopTOCReopenButton,
  tocColClassName,
  useDesktopTocCollapsed,
} from '../../TOC/DesktopCollapse';

import styles from './styles.module.css';

function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();

  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;

  const mobile = canRender ? <DocItemTOCMobile /> : undefined;

  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;

  return {
    hidden,
    mobile,
    desktop,
  };
}

export default function DocItemLayout({children}: Props): JSX.Element {
  const docTOC = useDocTOC();
  const {metadata} = useDoc();
  const {collapsed, collapse, expand} = useDesktopTocCollapsed();
  const showDesktopToc = Boolean(docTOC.desktop) && !collapsed;
  const contentExpanded = Boolean(docTOC.desktop) && collapsed;

  return (
    <div className="row">
      <div
        className={clsx(
          'col',
          !docTOC.hidden && !contentExpanded && styles.docItemCol,
          contentExpanded && styles.docItemColFull,
        )}>
        {contentExpanded && <DesktopTOCReopenButton onExpand={expand} />}
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {showDesktopToc && (
        <div className={clsx('col col--3', tocColClassName)}>
          <DesktopTOCPanel onCollapse={collapse}>
            {docTOC.desktop}
          </DesktopTOCPanel>
        </div>
      )}
    </div>
  );
}
