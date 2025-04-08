import React from 'react';
import styles from './styles.module.css';

export default function AdBanner() {
  return (
    <div className={styles.adContainer}>
      <div className={styles.adBanner}>
        {/* 广告内容将在这里显示 */}
        <p className={styles.adText}>广告位 - 您可以在这里放置您的广告内容</p>
      </div>
    </div>
  );
}
