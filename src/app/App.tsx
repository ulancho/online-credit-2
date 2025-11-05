import { Route, Routes, BrowserRouter } from 'react-router-dom';

import StartAuthRoute from '@/app/StartAuthRoute.tsx';
import ErrorMobile from 'Modules/errorMobile';
import StartMobile from 'Modules/startMobile';
import Error from 'src/modules/errorDesktop';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/oauth2/auth" element={<StartAuthRoute />} />
        <Route path="/start-mobile" element={<StartMobile />} />
        <Route path="/error-web" element={<Error />} />
        <Route path="/error-mobile" element={<ErrorMobile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
