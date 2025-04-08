import React from 'react';
import styles from './styles.module.css';

export default function AdBanner() {
  return (
    <div className={styles.adContainer}>
      <div className={styles.adBanner}>
        {/* 万维广告 */}
        <div className="wwads-cn wwads-horizontal" data-id="350"></div>
        <p className={styles.adText}>广告位 - 您可以在这里放置您的广告内容</p>
      </div>
    </div>
  );
}
