import styles from './DataFillSelectSheet.module.scss';

import type { Area } from '../../models/area';

interface DataFillSelectSheetProps {
  title: string;
  items: Area[];
  onSelect: (item: Area) => void;
  onClose: () => void;
  description?: string;
  variant?: 'bottom-sheet' | 'fullscreen';
}

export default function DataFillSelectSheet({
  title,
  items,
  onSelect,
  onClose,
  description,
  variant = 'bottom-sheet',
}: DataFillSelectSheetProps) {
  const isFullscreen = variant === 'fullscreen';

  return (
    <div
      className={[styles.overlay, isFullscreen ? styles.fullscreen : styles.bottomAligned].join(
        ' ',
      )}
      onClick={isFullscreen ? undefined : onClose}
    >
      <div
        className={[styles.sheet, isFullscreen ? styles.fullscreenSheet : styles.bottomSheet].join(
          ' ',
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {isFullscreen ? null : <div className={styles.handle} />}
        <div
          className={[
            styles.header,
            isFullscreen ? styles.fullscreenHeader : styles.bottomHeader,
          ].join(' ')}
        >
          {isFullscreen ? (
            <button className={styles.backButton} onClick={onClose} aria-label="Назад">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5.74023 11.9492C5.74023 12.2812 5.86719 12.5645 6.13086 12.8184L13.748 20.2695C13.9531 20.4844 14.2266 20.5918 14.5391 20.5918C15.1738 20.5918 15.6719 20.1035 15.6719 19.459C15.6719 19.1465 15.5449 18.8633 15.3301 18.6484L8.46484 11.9492L15.3301 5.25C15.5449 5.02539 15.6719 4.74219 15.6719 4.42969C15.6719 3.79492 15.1738 3.30664 14.5391 3.30664C14.2266 3.30664 13.9531 3.41406 13.748 3.62891L6.13086 11.0801C5.86719 11.334 5.75 11.6172 5.74023 11.9492Z"
                  fill="#129958"
                />
              </svg>
            </button>
          ) : null}
          <div className={styles.titleBlock}>
            <h2 className={isFullscreen ? styles.titleFullscreen : styles.titleBottom}>{title}</h2>
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
        </div>
        <div
          className={[styles.body, isFullscreen ? styles.fullscreenBody : styles.bottomBody].join(
            ' ',
          )}
        >
          <div className={styles.list}>
            {items.map((item) => (
              <button
                key={item.code}
                className={[
                  styles.item,
                  isFullscreen ? styles.itemFullscreen : styles.itemBottom,
                ].join(' ')}
                onClick={() => onSelect(item)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
