import { useEffect, useCallback, useRef } from 'react';

import type { ReactNode } from 'react';
import '../styles/Modal.scss';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean | null;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!closeOnEsc) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, closeOnEsc]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlay && e.target === overlayRef.current) {
        onClose();
      }
    },
    [closeOnOverlay, onClose],
  );

  const sizeMap: Record<ModalSize, string> = {
    sm: '340px',
    md: '460px',
    lg: '620px',
    xl: '780px',
    full: '96vw',
  };

  if (!isOpen) return null;

  return (
    <div className="m-overlay" ref={overlayRef} onClick={handleOverlayClick} role="presentation">
      <div
        className="m-dialog"
        style={{ maxWidth: sizeMap[size] }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="m-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="m-header">
          <h2 className="m-title" id="m-title">
            {title}
          </h2>

          {showCloseButton && (
            <button className="m-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          )}
        </div>

        <div className="m-body">{children}</div>

        {footer && <div className="m-footer">{footer}</div>}
      </div>
    </div>
  );
}
