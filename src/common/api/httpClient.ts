import axios from 'axios';

const baseURL = '/svc-biz-ib-cbk-private-credits/v1/api/webview';

// temporary token implementation
const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFpDSTZJamhtWVRNMU9UazBMVEUxTWpjdE5EWXhZaTA1WW1Sa0xXRTFNbUV4TWpJMk1UazJNeUlzSW1saGRDSTZNVGMzTkRNM05ESTNOaXdpWlhod0lqb3hOemMwTXpjME5UYzJmUS5ZSzdOUk84UjhLOGg1SlRoOWxpX2pYX0xPeWVmQ0NtNmFYMVk3QWtZbEpV';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    token: token,
  },
  timeout: 10000,
});
