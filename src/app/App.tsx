import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Start from '../modules/start';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
