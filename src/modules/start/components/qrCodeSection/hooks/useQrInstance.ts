import { useEffect, useRef, useState } from 'react';

import type {
  QrCodeStylingConstructor,
  QrCodeStylingInstance,
} from 'Common/types/qrCodeStyling.ts';

let qrLibraryPromise: Promise<QrCodeStylingConstructor> | null = null;

export const QR_CONFIG = {
  width: 232,
  height: 232,
  type: 'svg' as const,
  data: '',
  image: '',
  margin: 0,
  qrOptions: { errorCorrectionLevel: 'L' as const },
  dotsOptions: { color: '#111622', type: 'dots' as const },
  cornersSquareOptions: { type: 'extra-rounded' as const, color: '#111622' },
  cornersDotOptions: { color: '#111622', type: 'extra-rounded' as const },
  backgroundOptions: { color: '#ffffff' },
  imageOptions: {
    crossOrigin: 'anonymous' as const,
    hideBackgroundDots: true,
    margin: 4,
    imageSize: 1.2,
  },
};

function loadQrCodeStyling(): Promise<QrCodeStylingConstructor> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Библиотека QR-кодов недоступна.'));
  }

  if (qrLibraryPromise) return qrLibraryPromise;

  // eslint-disable-next-line import/no-unresolved
  qrLibraryPromise = import('qr-code-styling')
    .then((m) => {
      const Ctor = (m.default ?? null) as QrCodeStylingConstructor | null;
      if (!Ctor) throw new Error('Не удалось загрузить библиотеку QR-кодов.');
      return Ctor;
    })
    .catch((e) => {
      qrLibraryPromise = null;
      throw e;
    });

  return qrLibraryPromise;
}

/** Создаёт и монтирует QR-инстанс */
export function useQrInstance(
  containerRef: React.RefObject<HTMLDivElement | null>,
  config = QR_CONFIG,
) {
  const instanceRef = useRef<QrCodeStylingInstance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setError(null);

    loadQrCodeStyling()
      .then((Ctor) => {
        if (!alive) return;

        if (!instanceRef.current) {
          instanceRef.current = new Ctor(config);
        }

        const container = containerRef.current;
        if (container) {
          container.innerHTML = '';
          instanceRef.current.append(container);
        }
      })
      .catch((e) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : 'Не удалось загрузить библиотеку QR-кодов.');
      });

    return () => {
      alive = false;
    };
  }, [containerRef, config]);

  // на случай ре-рендера контейнера
  useEffect(() => {
    if (!instanceRef.current || !containerRef.current) return;
    if (containerRef.current.childElementCount === 0) {
      instanceRef.current.append(containerRef.current);
    }
  }, [containerRef]);

  return { instanceRef, error };
}
