import axios from 'axios';
import { configure } from 'mobx';
import { createRoot } from 'react-dom/client';

import { applyLanguageInterceptor } from 'Common/api/languageInterceptor.ts';

import AppWrapper from './app/AppWrapper.tsx';

import './styles/index.scss';

configure({
  enforceActions: 'observed',
});
applyLanguageInterceptor(axios);
createRoot(document.getElementById('root')!).render(<AppWrapper />);
