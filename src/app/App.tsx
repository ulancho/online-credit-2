import classNames from 'classnames';
import { Route, Routes, BrowserRouter, useLocation } from 'react-router-dom';

import StartAuthRoute from '@/app/StartAuthRoute.tsx';
import LanguageSwitcher from 'Common/components/languageSwitcher/LanguageSwitcher.tsx';
import License from 'Common/components/license/License.tsx';
import { isMobileUserAgent } from 'Common/utils/isMobileUserAgent.ts';
import Error from 'Modules/errorDesktop';
import ErrorMobile from 'Modules/errorMobile';

import styles from './styles/App.module.scss';

const AppContent = () => {
  const location = useLocation();
  const isMobileStartRoute = location.pathname === '/oauth2/auth' && isMobileUserAgent();

  return (
    <div className={styles.appLayout}>
      <div
        className={classNames(styles.routesWrapper, {
          [styles.routesWrapperMobile]: isMobileStartRoute,
        })}
      >
        <Routes>
          <Route path="/oauth2/auth" element={<StartAuthRoute />} />
          <Route path="/error-web" element={<Error />} />
          <Route path="/error-mobile" element={<ErrorMobile />} />
        </Routes>
        {!isMobileStartRoute && <LanguageSwitcher />}
        <License />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
