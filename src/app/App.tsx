import classNames from 'classnames';
import { Route, Routes, BrowserRouter, useLocation } from 'react-router-dom';

import StartAuthRoute from '@/app/StartAuthRoute.tsx';
import LanguageSwitcher from 'Common/components/languageSwitcher/LanguageSwitcher.tsx';
import License from 'Common/components/license/License.tsx';
import Error from 'Modules/errorDesktop';
import ErrorMobile from 'Modules/errorMobile';
import StartMobile from 'Modules/startMobile';

import styles from './styles/App.module.scss';

const StartMobileRoute = () => (
  <>
    <StartMobile />
    <LanguageSwitcher />
  </>
);

const AppContent = () => {
  const location = useLocation();
  const isMobileRoute = location.pathname === '/start-mobile';

  return (
    <div className={styles.appLayout}>
      <div
        className={classNames(styles.routesWrapper, {
          [styles.routesWrapperMobile]: isMobileRoute,
        })}
      >
        <Routes>
          <Route path="/oauth2/auth" element={<StartAuthRoute />} />
          <Route path="/start-mobile" element={<StartMobileRoute />} />
          <Route path="/error-web" element={<Error />} />
          <Route path="/error-mobile" element={<ErrorMobile />} />
        </Routes>
        {!isMobileRoute && <LanguageSwitcher />}
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
