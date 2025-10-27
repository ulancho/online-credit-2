import { configure } from 'mobx';
import { createRoot } from 'react-dom/client';

import AppWrapper from './app/AppWrapper.tsx';
import './styles/index.scss';

configure({
  enforceActions: 'observed',
});

console.log('MBankID version:', __PROJECT_VERSION__);

createRoot(document.getElementById('root')!).render(<AppWrapper />);
