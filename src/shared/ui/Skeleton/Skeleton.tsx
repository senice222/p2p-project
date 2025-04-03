import React from 'react';
import styles from './Skeleton.module.scss';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.avatar}></div>
      <div className={styles.content}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
    </div>
  );
};
