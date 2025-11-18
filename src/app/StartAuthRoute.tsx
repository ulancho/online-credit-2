import { useMemo } from 'react';

import { isMobileUserAgent } from 'Common/utils/isMobileUserAgent.ts';
import StartDesktop from 'Modules/startDesktop';
import StartMobile from 'Modules/startMobile';

function StartAuthRoute() {
  const isMobile = useMemo(() => isMobileUserAgent(), []);

  return !isMobile ? <StartMobile /> : <StartDesktop />;
}

export default StartAuthRoute;
