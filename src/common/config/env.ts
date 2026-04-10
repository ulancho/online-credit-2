const trimTrailingSlash = (value: string) => value.replace(/\/$/, '');

const requiredEnv = (value: string | undefined, fallback: string) => {
  const resolved = value?.trim() || fallback;

  return trimTrailingSlash(resolved);
};

export const appEnv = {
  apiBaseUrl: requiredEnv(
    import.meta.env.VITE_API_BASE_URL,
    '/svc-biz-ib-cbk-private-credits/v1/api/webview',
  ),
  directoryBaseUrl: requiredEnv(import.meta.env.VITE_DIRECTORY_BASE_URL, ''),
  documentsBaseUrl: requiredEnv(
    import.meta.env.VITE_DOCUMENTS_BASE_URL,
    '/svc-biz-ib-cbk-documents/v1/unauthorized-api/documents/by-code',
  ),
  closeAppUrl: requiredEnv(import.meta.env.VITE_CLOSE_APP_URL, '/online-credit-front/close'),
  extendedQuestionnaireUrl: (appToken: string) => {
    return requiredEnv(
      `${import.meta.env.VITE_EXTENDED_QUESTIONNAIRE_URL}?token=${appToken}`,
      `https://credit.mbank.kg/credit/online/extended?token=${appToken}`,
    );
  },
  refinancingAppUrl: requiredEnv(
    import.meta.env.VITE_REFINANCING_APP_URL,
    'https://app.mbank.kg/web/refinancing',
  ),
};
