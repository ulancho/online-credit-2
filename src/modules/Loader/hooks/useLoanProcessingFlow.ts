import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import { checkActiveApplicationStatus } from '../api/loanProcessingApi.ts';

const MAIN_TICK_MIN_MS = 300;
const MAIN_TICK_MAX_MS = 700;
const FAST_TICK_MS = 40;
const WAITING_NAVIGATION_DELAY_MS = 200;
const MAX_PROGRESS = 100;

type VoidCallback = () => void;

interface UseLoanProcessingFlowOptions {
  onDenied: VoidCallback;
  onWaiting: VoidCallback;
  onFinalSuccess: VoidCallback;
  onErrorToHome: VoidCallback;
}

function getRandomTickDelay() {
  return Math.floor(Math.random() * (MAIN_TICK_MAX_MS - MAIN_TICK_MIN_MS + 1)) + MAIN_TICK_MIN_MS;
}

export function useLoanProcessingFlow({
  onDenied,
  onWaiting,
  onFinalSuccess,
  onErrorToHome,
}: UseLoanProcessingFlowOptions) {
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);
  const finishedRef = useRef(false);
  const mainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fastTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waitingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeControllersRef = useRef(new Set<AbortController>());
  const polledMarksRef = useRef(new Set<number>());
  const finalRequestedRef = useRef(false);

  const syncProgress = useCallback((nextProgress: number) => {
    const clampedProgress = Math.min(MAX_PROGRESS, nextProgress);
    progressRef.current = clampedProgress;
    setProgress(clampedProgress);
  }, []);

  const clearMainTimer = useCallback(() => {
    if (!mainTimerRef.current) {
      return;
    }

    clearTimeout(mainTimerRef.current);
    mainTimerRef.current = null;
  }, []);

  const clearFastTimer = useCallback(() => {
    if (!fastTimerRef.current) {
      return;
    }

    clearInterval(fastTimerRef.current);
    fastTimerRef.current = null;
  }, []);

  const clearWaitingTimer = useCallback(() => {
    if (!waitingTimerRef.current) {
      return;
    }

    clearTimeout(waitingTimerRef.current);
    waitingTimerRef.current = null;
  }, []);

  const abortInFlightRequests = useCallback(() => {
    activeControllersRef.current.forEach((controller) => controller.abort());
    activeControllersRef.current.clear();
  }, []);

  const finishOnce = useCallback((callback: VoidCallback) => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    callback();
  }, []);

  const fastCompleteAndThen = useCallback(
    (callback: VoidCallback) => {
      clearMainTimer();
      clearFastTimer();

      fastTimerRef.current = setInterval(() => {
        const current = progressRef.current;

        if (current >= MAX_PROGRESS) {
          clearFastTimer();
          callback();
          return;
        }

        syncProgress(current + 1);
      }, FAST_TICK_MS);
    },
    [clearFastTimer, clearMainTimer, syncProgress],
  );

  const requestStatus = useCallback(
    async (lastRequest: boolean) => {
      const controller = new AbortController();
      activeControllersRef.current.add(controller);

      try {
        const result = await checkActiveApplicationStatus({
          lastRequest,
          signal: controller.signal,
        });

        if (controller.signal.aborted || finishedRef.current) {
          return;
        }

        if (result.status === 'denied' || result.status === 'extended') {
          fastCompleteAndThen(() => finishOnce(onDenied));
          return;
        }

        if (result.status === 'waiting') {
          fastCompleteAndThen(() => {
            clearWaitingTimer();
            waitingTimerRef.current = setTimeout(() => {
              finishOnce(onWaiting);
            }, WAITING_NAVIGATION_DELAY_MS);
          });
          return;
        }

        if (lastRequest) {
          finishOnce(onFinalSuccess);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        if (lastRequest) {
          console.error('Final status request failed', error);
          alert(
            'Не удалось получить финальный статус заявки. Вы будете перенаправлены на главную страницу.',
          );
          finishOnce(onErrorToHome);
          return;
        }

        if (!axios.isCancel(error)) {
          console.error('Intermediate status polling failed', error);
        }
      } finally {
        activeControllersRef.current.delete(controller);
      }
    },
    [
      clearWaitingTimer,
      fastCompleteAndThen,
      finishOnce,
      onDenied,
      onErrorToHome,
      onFinalSuccess,
      onWaiting,
    ],
  );

  useEffect(() => {
    const scheduleTick = () => {
      if (finishedRef.current) {
        return;
      }

      mainTimerRef.current = setTimeout(() => {
        const current = progressRef.current;

        if (current < MAX_PROGRESS) {
          syncProgress(current + 1);
          scheduleTick();
          return;
        }

        clearMainTimer();
      }, getRandomTickDelay());
    };

    scheduleTick();

    return () => {
      clearMainTimer();
      clearFastTimer();
      clearWaitingTimer();
      abortInFlightRequests();
      finishedRef.current = true;
    };
  }, [abortInFlightRequests, clearFastTimer, clearMainTimer, clearWaitingTimer, syncProgress]);

  useEffect(() => {
    if (finishedRef.current) {
      return;
    }

    if (progress === MAX_PROGRESS) {
      if (finalRequestedRef.current) {
        return;
      }

      finalRequestedRef.current = true;
      clearMainTimer();
      void requestStatus(true);
      return;
    }

    if (progress > 0 && progress % 10 === 0 && !polledMarksRef.current.has(progress)) {
      polledMarksRef.current.add(progress);
      void requestStatus(false);
    }
  }, [clearMainTimer, progress, requestStatus]);

  return {
    progress,
    isFlowFinished: finishedRef.current,
  };
}
