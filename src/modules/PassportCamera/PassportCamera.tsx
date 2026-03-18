/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useCallback, useEffect } from 'react';

import { uploadPassportPhotos } from './api';
import styles from './PassportCamera.module.scss';

type Step = 'front-camera' | 'front-preview' | 'back-camera' | 'back-preview' | 'uploading';

interface PassportCameraProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function PassportCamera({ onBack, onSuccess }: PassportCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [step, setStep] = useState<Step>('front-camera');
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [backPhoto, setBackPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isCameraStep = step === 'front-camera' || step === 'back-camera';
  const isPreviewStep = step === 'front-preview' || step === 'back-preview';
  const isFrontSide = step === 'front-camera' || step === 'front-preview';
  const sideName = isFrontSide ? 'Лицевая сторона' : 'Обратная сторона';
  const previewPhoto =
    step === 'front-preview' ? frontPhoto : step === 'back-preview' ? backPhoto : null;

  const startCamera = useCallback(async () => {
    setCameraError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Камера не поддерживается');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        setCameraError('Доступ к камере запрещён');
      } else if (error.name === 'NotFoundError') {
        setCameraError('Камера не найдена');
      } else {
        setCameraError('Ошибка камеры');
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (isCameraStep) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();

    if (step === 'front-camera') {
      setFrontPhoto(dataUrl);
      setStep('front-preview');
    } else {
      setBackPhoto(dataUrl);
      setStep('back-preview');
    }
  }, [step, stopCamera]);

  const handleRetake = useCallback(() => {
    if (step === 'front-preview') {
      setFrontPhoto(null);
      setStep('front-camera');
    } else {
      setBackPhoto(null);
      setStep('back-camera');
    }
  }, [step]);

  const handleKeep = useCallback(async () => {
    if (step === 'front-preview') {
      setStep('back-camera');
    } else if (step === 'back-preview' && frontPhoto && backPhoto) {
      setStep('uploading');
      setUploadError(null);
      try {
        await uploadPassportPhotos(frontPhoto, backPhoto);
        onSuccess?.();
      } catch {
        setUploadError('Ошибка отправки. Попробуйте снова.');
        setStep('back-preview');
      }
    }
  }, [step, frontPhoto, backPhoto, onSuccess]);

  if (step === 'uploading') {
    return (
      <div className={styles.uploadingScreen}>
        <div className={styles.spinner} />
        <p className={styles.uploadingText}>Отправка документов...</p>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      {/* Camera video / captured photo layer */}
      <div className={styles.mediaLayer}>
        {isCameraStep && (
          <video ref={videoRef} className={styles.videoFeed} autoPlay playsInline muted />
        )}
        {isPreviewStep && previewPhoto && (
          <img src={previewPhoto} className={styles.previewImage} alt="Фото паспорта" />
        )}
      </div>
      {/* Darkened overlay with passport frame cutout */}
      <div className={styles.overlayLayer} aria-hidden="true">
        <div className={styles.passportFrame} />
      </div>
      {/* Back navigation button */}
      <button className={styles.backBtn} onClick={onBack} aria-label="Назад">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5.74023 11.9492C5.74023 12.2812 5.86719 12.5645 6.13086 12.8184L13.748 20.2695C13.9531 20.4844 14.2266 20.5918 14.5391 20.5918C15.1738 20.5918 15.6719 20.1035 15.6719 19.459C15.6719 19.1465 15.5449 18.8633 15.3301 18.6484L8.46484 11.9492L15.3301 5.25C15.5449 5.02539 15.6719 4.74219 15.6719 4.42969C15.6719 3.79492 15.1738 3.30664 14.5391 3.30664C14.2266 3.30664 13.9531 3.41406 13.748 3.62891L6.13086 11.0801C5.86719 11.334 5.75 11.6172 5.74023 11.9492Z"
            fill="white"
          />
        </svg>
      </button>
      {/* Title + subtitle (camera mode only) */}
      {isCameraStep && (
        <div className={styles.titleSection}>
          <h2 className={styles.pageTitle}>
            Сделайте фото Вашего ID паспорта КР для прохождение идентификации
          </h2>
          <p className={styles.pageSubtitle}>Убедитесь, что данные хорошо читаются</p>
        </div>
      )}
      {/* Side label badge */}
      <div className={styles.sideBadgeWrapper}>
        <span className={styles.sideBadge}>{sideName}</span>
      </div>
      {/* Camera error message */}
      {cameraError && <div className={styles.cameraErrorMsg}>{cameraError}</div>}
      {/* Bottom: capture controls */}
      {isCameraStep && (
        <div className={styles.captureBar}>
          {step === 'back-camera' && frontPhoto ? (
            <div className={styles.frontThumbnail}>
              <img src={frontPhoto} alt="Лицевая сторона" />
              <span className={styles.doneLabel}>Готово</span>
            </div>
          ) : (
            <div className={styles.thumbnailSlot} />
          )}
          <button className={styles.shutterBtn} onClick={capturePhoto} aria-label="Сделать фото">
            <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M34 60.9897C48.906 60.9897 60.9897 48.906 60.9897 34C60.9897 19.094 48.906 7.01031 34 7.01031C19.094 7.01031 7.01031 19.094 7.01031 34C7.01031 48.906 19.094 60.9897 34 60.9897ZM34 68C52.7777 68 68 52.7777 68 34C68 15.2223 52.7777 0 34 0C15.2223 0 0 15.2223 0 34C0 52.7777 15.2223 68 34 68Z"
                fill="white"
              />
              <circle cx="34.0003" cy="34.0003" r="22.7835" fill="white" />
            </svg>
          </button>
          <div className={styles.captureBarSpacer} />
        </div>
      )}
      {/* Bottom: preview action buttons */}
      {isPreviewStep && (
        <div className={styles.previewActionsBar}>
          <div className={styles.previewButtons}>
            <button className={styles.retakeBtn} onClick={handleRetake}>
              Переснять
            </button>
            <button className={styles.keepBtn} onClick={handleKeep}>
              Оставить
            </button>
          </div>
          <div className={styles.homeIndicatorDark} />
        </div>
      )}
      {/* Upload error */}
      {uploadError && <div className={styles.uploadErrorMsg}>{uploadError}</div>}
      {/* Home indicator (camera mode) */}
      {isCameraStep && <div className={styles.homeIndicatorLight} />}
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className={styles.hiddenCanvas} />
    </div>
  );
}
