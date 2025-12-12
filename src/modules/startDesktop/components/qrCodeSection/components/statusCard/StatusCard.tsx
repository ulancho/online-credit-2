import { type MutableRefObject } from 'react';

import { AUTH_STATUSES } from 'Common/types/authStatus.ts';

import { BoundStatus } from './../boundStatus/BoundStatus.tsx';
import { ConfirmedStatus } from './../confirmedStatus/ConfirmedStatus.tsx';
import { DefaultStatus } from './../defaultStatus/DefaultStatus.tsx';
import { DeniedStatus } from './../deniedStatus/DeniedStatus.tsx';
import styles from './StatusCard.module.scss';

import type { AuthStatus } from 'Common/types/authStatus.ts';

interface StatusCardProps {
  status: AuthStatus | null;
  qrContainerRef: MutableRefObject<HTMLDivElement | null>;
  qrReady: boolean;
  qrError: string | null;
  libraryError: string | null;
  isLoading: boolean;
  timerLabel: string | null;
  onRetry: () => void;
}

export const StatusCard = ({
  status,
  qrContainerRef,
  qrReady,
  qrError,
  libraryError,
  isLoading,
  timerLabel,
  onRetry,
}: StatusCardProps) => {
  const baseClassName = styles.container;

  switch (status) {
    case AUTH_STATUSES.CONFIRMED:
      return (
        <div className={`${baseClassName} ${styles.statusContainer}`}>
          <ConfirmedStatus />
        </div>
      );
    case AUTH_STATUSES.BOUND:
      return (
        <div className={`${baseClassName} ${styles.statusContainer}`}>
          <BoundStatus />
        </div>
      );
    case AUTH_STATUSES.DENIED:
      return (
        <div className={`${baseClassName} ${styles.statusContainer}`}>
          <DeniedStatus onRetry={onRetry} isLoading={isLoading} />
        </div>
      );
    case AUTH_STATUSES.EXPIRED:
      return (
        <div className={`${baseClassName} ${styles.statusContainer}`}>
          <DeniedStatus onRetry={onRetry} isLoading={isLoading} />
        </div>
      );
    case AUTH_STATUSES.GENERATED:
      return (
        <div className={baseClassName}>
          <DefaultStatus
            qrContainerRef={qrContainerRef}
            qrReady={qrReady}
            qrError={qrError}
            libraryError={libraryError}
            isLoading={isLoading}
            timerLabel={timerLabel}
          />
        </div>
      );
  }
};
