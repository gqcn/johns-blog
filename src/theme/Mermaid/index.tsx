/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useRef, useState} from 'react';
import type {MouseEvent, ReactNode} from 'react';
import {createPortal} from 'react-dom';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {ErrorBoundaryErrorMessageFallback} from '@docusaurus/theme-common';
import {
  MermaidContainerClassName,
  useMermaidRenderResult,
} from '@docusaurus/theme-mermaid/client';
import type {Props} from '@theme/Mermaid';
import {
  LoaderCircle,
  Maximize2,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type {RenderResult} from 'mermaid';
import {TransformComponent, TransformWrapper} from 'react-zoom-pan-pinch';

import styles from './styles.module.css';

function MermaidRenderResult({
  renderResult,
  className,
}: {
  renderResult: RenderResult;
  className?: string;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = ref.current!;
    renderResult.bindFunctions?.(div);
  }, [renderResult]);

  return (
    <div
      ref={ref}
      className={`${MermaidContainerClassName} ${styles.container} ${className ?? ''}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: renderResult.svg}}
    />
  );
}

function MermaidViewer({
  value,
  onClose,
}: {
  value: Props['value'];
  onClose: () => void;
}): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const renderResult = useMermaidRenderResult({text: value});

  useEffect(() => {
    const dialog = dialogRef.current!;
    const previousOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className={styles.viewer}
      aria-label="Mermaid 图表全屏查看器"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={8}
        centerOnInit
        centerZoomedOut
        limitToBounds={false}
        wheel={{step: 0.12}}
        doubleClick={{mode: 'zoomIn', step: 0.7}}>
        {({zoomIn, zoomOut, resetTransform}) => (
          <div className={styles.viewerLayout}>
            <div className={styles.toolbar}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="放大"
                title="放大"
                onClick={() => zoomIn()}>
                <ZoomIn aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="缩小"
                title="缩小"
                onClick={() => zoomOut()}>
                <ZoomOut aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="复位"
                title="复位"
                onClick={() => resetTransform()}>
                <RotateCcw aria-hidden="true" />
              </button>
              <span className={styles.toolbarDivider} aria-hidden="true" />
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.iconButton}
                aria-label="关闭"
                title="关闭"
                onClick={onClose}>
                <X aria-hidden="true" />
              </button>
            </div>

            <div className={styles.canvas}>
              {renderResult === null ? (
                <div className={styles.loading} role="status" aria-label="正在加载图表">
                  <LoaderCircle aria-hidden="true" />
                </div>
              ) : (
                <TransformComponent
                  wrapperClass={styles.transformWrapper}
                  contentClass={styles.transformContent}>
                  <MermaidRenderResult
                    renderResult={renderResult}
                    className={styles.viewerDiagram}
                  />
                </TransformComponent>
              )}
            </div>
          </div>
        )}
      </TransformWrapper>
    </dialog>,
    document.body,
  );
}

function MermaidRenderer({value}: Props): ReactNode {
  const [viewerOpen, setViewerOpen] = useState(false);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const renderResult = useMermaidRenderResult({text: value});

  if (renderResult === null) {
    return null;
  }

  const openViewer = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (target instanceof Element && target.closest('a')) {
      return;
    }
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    requestAnimationFrame(() => expandButtonRef.current?.focus());
  };

  return (
    <>
      <div className={styles.preview} onClick={openViewer}>
        <MermaidRenderResult renderResult={renderResult} />
        <button
          ref={expandButtonRef}
          type="button"
          className={styles.expandButton}
          aria-label="全屏查看 Mermaid 图表"
          title="全屏查看">
          <Maximize2 aria-hidden="true" />
        </button>
      </div>
      {viewerOpen && <MermaidViewer value={value} onClose={closeViewer} />}
    </>
  );
}

export default function Mermaid(props: Props): JSX.Element {
  return (
    <ErrorBoundary
      fallback={(params) => <ErrorBoundaryErrorMessageFallback {...params} />}>
      <MermaidRenderer {...props} />
    </ErrorBoundary>
  );
}
