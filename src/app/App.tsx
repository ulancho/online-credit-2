import classNames from 'classnames';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import StartAuthRoute from '@/app/StartAuthRoute.tsx';
import LanguageSwitcher from 'Common/components/languageSwitcher/LanguageSwitcher.tsx';
import License from 'Common/components/license/License.tsx';
import OrientationNotice from 'Common/components/orientationNotice/OrientationNotice.tsx';
import { isMobileUserAgent } from 'Common/utils/isMobileUserAgent.ts';
import ErrorDesktop from 'Modules/errorDesktop';
import ErrorMobile from 'Modules/errorMobile';

import styles from './styles/App.module.scss';

const AppContent = () => {
  const isMobile = isMobileUserAgent();

  return (
    <div className={styles.appLayout}>
      {isMobile && <OrientationNotice />}
      <div
        className={classNames(styles.routesWrapper, {
          [styles.routesWrapperMobile]: isMobile,
        })}
      >
        <Routes>
          <Route path="/oauth2/auth" element={<StartAuthRoute />} />
          <Route path="/error-web" element={<ErrorDesktop />} />
          <Route path="/error-mobile" element={<ErrorMobile />} />
        </Routes>
        {!isMobile && <LanguageSwitcher />}
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
