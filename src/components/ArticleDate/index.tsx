import React, {useLayoutEffect, useRef} from 'react';
import {usePluginData} from '@docusaurus/useGlobalData';
import {Calendar} from 'lucide-react';

import styles from './styles.module.css';

export type ArticleGitDate = {
  updated: string;
  published: string;
  /** Newest commit is the history rewrite, not a content edit. */
  snapshot: boolean;
  /** Oldest remaining commit is the history rewrite, not a real publish. */
  bornInSnapshot: boolean;
};

type ArticleDateData = {
  dates: Record<string, ArticleGitDate>;
  listPages?: Record<string, true>;
};

function articleSourceKey(source: string): string {
  return source.replace(/^@site\//, '');
}

export function useArticleGitDate(
  source: string | undefined,
): ArticleGitDate | undefined {
  const data = usePluginData('article-dates') as ArticleDateData;
  if (!source) {
    return undefined;
  }
  return data.dates[articleSourceKey(source)];
}

/** Category landings are card lists, so they do not show a publish or update day. */
export function useIsCategoryListPage(source: string | undefined): boolean {
  const data = usePluginData('article-dates') as ArticleDateData;
  if (!source) {
    return false;
  }
  return Boolean(data.listPages?.[articleSourceKey(source)]);
}

function dayFromFrontMatter(value: unknown): string | undefined {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? undefined
      : value.toISOString().slice(0, 10);
  }
  if (typeof value === 'string') {
    const match = /^(\d{4}-\d{2}-\d{2})/.exec(value.trim());
    return match?.[1];
  }
  return undefined;
}

export function resolveDocDates(
  git: ArticleGitDate | undefined,
  frontMatter: {date?: unknown; last_update?: {date?: unknown}},
): {updated?: string} {
  const published =
    dayFromFrontMatter(frontMatter.date) ??
    (git && !git.bornInSnapshot ? git.published : undefined);
  const updated =
    dayFromFrontMatter(frontMatter.last_update?.date) ?? git?.updated;
  // The corner shows one day: the last content edit. A page that was never
  // edited after it appeared still uses that first day as the update day.
  const day = updated ?? published;
  return day ? {updated: day} : {};
}

function DateTime({day}: {day: string}) {
  return (
    <time dateTime={day} itemProp="dateModified">
      {day}
    </time>
  );
}

function isHeading(el: Element): el is HTMLElement {
  return el instanceof HTMLElement && /^H[1-3]$/.test(el.tagName);
}

/**
 * Align only when the body actually opens with a heading.
 * A later heading must not pull the date down through the opening paragraphs.
 */
function findLeadingHeading(
  scope: HTMLElement,
  chip: HTMLElement,
): HTMLElement | null {
  for (const child of scope.children) {
    if (!(child instanceof HTMLElement) || child === chip) {
      continue;
    }
    if (child.closest('.card')) {
      return null;
    }
    if (isHeading(child)) {
      return child;
    }
    if (child.tagName === 'HEADER') {
      const heading = child.querySelector(':scope > h1, :scope > h2, :scope > h3');
      return heading instanceof HTMLElement ? heading : null;
    }
    return null;
  }
  return null;
}

function useAlignTopWithHeading(
  ref: React.RefObject<HTMLDivElement | null>,
): void {
  useLayoutEffect(() => {
    const chip = ref.current;
    const scope = chip?.parentElement;
    if (!chip || !scope) {
      return;
    }

    let tries = 0;
    const align = () => {
      if (tries >= 3) {
        return;
      }
      const heading = findLeadingHeading(scope, chip);
      if (!heading) {
        chip.style.marginTop = '';
        return;
      }
      const delta =
        heading.getBoundingClientRect().top - chip.getBoundingClientRect().top;
      if (Math.abs(delta) < 0.5) {
        return;
      }
      tries += 1;
      const current = Number.parseFloat(getComputedStyle(chip).marginTop) || 0;
      chip.style.marginTop = `${current + delta}px`;
    };

    align();
    const observer = new ResizeObserver(align);
    observer.observe(scope);
    window.addEventListener('resize', align);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', align);
    };
  }, [ref]);
}

function ArticleDateChip({updated}: {updated?: string}): JSX.Element | null {
  const ref = useRef<HTMLDivElement>(null);
  useAlignTopWithHeading(ref);

  if (!updated) {
    return null;
  }

  return (
    <div ref={ref} className={`${styles.corner} articleDateCorner`}>
      <div className={styles.chip}>
        <Calendar
          className={styles.icon}
          size={14}
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span className={styles.item}>
          <span className={styles.label}>发布于</span>
          <DateTime day={updated} />
        </span>
      </div>
    </div>
  );
}

export default function ArticleDate({
  updated,
}: {
  updated?: string;
}): JSX.Element | null {
  return <ArticleDateChip updated={updated} />;
}
