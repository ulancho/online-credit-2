import { type MutableRefObject } from 'react';

import { BoundStatus } from './../boundStatus/BoundStatus.tsx';
import { ConfirmedStatus } from './../confirmedStatus/ConfirmedStatus.tsx';
import { DefaultStatus } from './../defaultStatus/DefaultStatus.tsx';
import { DeniedStatus } from './../deniedStatus/DeniedStatus.tsx';
import styles from './StatusCard.module.scss';

interface StatusCardProps {
  status: string | null;
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
    case 'CONFIRMED':
      return (
        <div className={`${baseClassName} ${styles.statusContainer}`}>
          <ConfirmedStatus />
        </div>
      );
    case 'BOUND':
      return (
        <div className={`${baseClassName} ${styles.statusContainer}`}>
          <BoundStatus />
        </div>
      );
    case 'DENIED':
      return (
        <div className={`${baseClassName} ${styles.statusContainer}`}>
          <DeniedStatus onRetry={onRetry} isLoading={isLoading} />
        </div>
      );
    // данный стейт скрыт, так как если EXPIRED то на фоне запрашиваю данные для QR заново и рендерим новый QR
    // case 'EXPIRED':
    //   return (
    //     <div className={`${baseClassName} ${styles.statusContainer}`}>
    //       <ExpiredStatus />
    //     </div>
    //   );
    default:
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
