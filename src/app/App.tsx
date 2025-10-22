import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Error from 'Modules/error';
import ErrorMobile from 'Modules/errorMobile';
import Start from 'Modules/start';
import StartMobile from 'Modules/startMobile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/start-mobile" element={<StartMobile />} />
        <Route path="/error-web" element={<Error />} />
        <Route path="/error-mobile" element={<ErrorMobile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
