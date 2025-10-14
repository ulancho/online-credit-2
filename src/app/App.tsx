import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Start from 'Modules/start';
import StartMobile from 'Modules/startMobile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/start-mobile" element={<StartMobile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
