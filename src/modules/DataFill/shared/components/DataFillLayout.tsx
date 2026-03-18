
import NavBar from 'Common/components/NavBar/NavBar.tsx';

import { DATA_FILL_TITLE } from '../constants.ts';

import styles from './DataFillLayout.module.scss';

import type { ReactNode } from 'react';

interface DataFillLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
  onBack: () => void;
  title?: string;
  progress?: ReactNode;
  contentClassName?: string;
}

export default function DataFillLayout({
  children,
  footer,
  onBack,
  title = DATA_FILL_TITLE,
  progress,
  contentClassName,
}: DataFillLayoutProps) {
  return (
    <div id="page" className={styles.page}>
      <NavBar onBack={onBack} />
      {title ? (
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>{title}</h1>
        </div>
      ) : null}
      {progress}
      <div className={[styles.content, contentClassName].filter(Boolean).join(' ')}>{children}</div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
}
