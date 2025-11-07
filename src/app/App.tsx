import { Route, Routes, BrowserRouter } from 'react-router-dom';

import StartAuthRoute from '@/app/StartAuthRoute.tsx';
import AppHeader from 'Common/components/appHeader/AppHeader.tsx';
import Error from 'Modules/errorDesktop';
import ErrorMobile from 'Modules/errorMobile';
import StartMobile from 'Modules/startMobile';

import styles from './styles/App.module.scss';

function App() {
  return (
    <BrowserRouter>
      <div className={styles.appLayout}>
        <AppHeader />
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <div className={styles.routesWrapper}>
              <Routes>
                <Route path="/oauth2/auth" element={<StartAuthRoute />} />
                <Route path="/start-mobile" element={<StartMobile />} />
                <Route path="/error-web" element={<Error />} />
                <Route path="/error-mobile" element={<ErrorMobile />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
