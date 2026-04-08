import axios from 'axios';
import { configure } from 'mobx';
import { createRoot } from 'react-dom/client';

import { applyLanguageInterceptor } from 'Common/api/languageInterceptor.ts';

import AppWrapper from './app/AppWrapper.tsx';

import './styles/index.scss';

console.log(import.meta.env.MODE);
console.log(import.meta.env.VITE_API_BASE_URL);

configure({
  enforceActions: 'observed',
});
applyLanguageInterceptor(axios);
createRoot(document.getElementById('root')!).render(<AppWrapper />);
