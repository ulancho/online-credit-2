import classNames from 'classnames';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import StartAuthRoute from '@/app/StartAuthRoute.tsx';
import LanguageSwitcher from 'Common/components/languageSwitcher/LanguageSwitcher.tsx';
import License from 'Common/components/license/License.tsx';
import { isMobileUserAgent } from 'Common/utils/isMobileUserAgent.ts';
import ErrorDesktop from 'Modules/errorDesktop';
import ErrorMobile from 'Modules/errorMobile';

import styles from './styles/App.module.scss';

const AppContent = () => {
  return (
    <div className={styles.appLayout}>
      <div
        className={classNames(styles.routesWrapper, {
          [styles.routesWrapperMobile]: isMobileUserAgent(),
        })}
      >
        <Routes>
          <Route path="/oauth2/auth" element={<StartAuthRoute />} />
          <Route path="/error-web" element={<ErrorDesktop />} />
          <Route path="/error-mobile" element={<ErrorMobile />} />
        </Routes>
        {!isMobileUserAgent() && <LanguageSwitcher />}
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
