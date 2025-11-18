const MOBILE_USER_AGENT_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export const isMobileUserAgent = () => {
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
};
