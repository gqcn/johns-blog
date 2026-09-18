/**
 * Swizzled from @docusaurus/theme-classic TOCItems/Tree.
 * Adds native title tooltip with the full heading text so truncated
 * TOC labels still expose their complete content on hover.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/TOCItems/Tree';

function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Recursive component rendering the toc tree
function TOCItemTree({
  toc,
  className,
  linkClassName,
  isChild,
}: Props): JSX.Element | null {
  if (!toc.length) {
    return null;
  }
  return (
    <ul className={isChild ? undefined : className}>
      {toc.map((heading) => {
        const plainTitle = htmlToPlainText(heading.value);
        return (
          <li key={heading.id}>
            <Link
              to={`#${heading.id}`}
              className={linkClassName ?? undefined}
              title={plainTitle || undefined}
              // Developer provided the HTML, so assume it's safe.
              dangerouslySetInnerHTML={{__html: heading.value}}
            />
            <TOCItemTree
              isChild
              toc={heading.children}
              className={className}
              linkClassName={linkClassName}
            />
          </li>
        );
      })}
    </ul>
  );
}

// Memo only the tree root is enough
export default React.memo(TOCItemTree);
