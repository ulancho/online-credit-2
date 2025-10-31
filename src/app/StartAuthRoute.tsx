import { useMemo } from 'react';

import Start from 'Modules/start';
import StartMobile from 'Modules/startMobile';

const MOBILE_USER_AGENT_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

function StartAuthRoute() {
  const isMobile = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return false;
    }

    const userAgentData = (
      navigator as Navigator & {
        userAgentData?: { mobile?: boolean };
      }
    ).userAgentData;

    if (typeof userAgentData?.mobile === 'boolean') {
      return userAgentData.mobile;
    }

    const userAgent = navigator.userAgent || navigator.vendor || '';

    return MOBILE_USER_AGENT_REGEX.test(userAgent);
  }, []);

  return isMobile ? <StartMobile /> : <Start />;
}

export default StartAuthRoute;
