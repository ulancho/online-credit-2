import axios from 'axios';

export const exitApp = () => {
  return axios.get('https://hub-dev.mbank.kg/online-credit-front/close');
};
