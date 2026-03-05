import { Route, Routes, BrowserRouter } from 'react-router-dom';

import CreditCalculator from 'Modules/CreditCalculator/CreditCalculator.tsx';
import Loader from 'Modules/Loader/Loader.tsx';
import OtpVerification from 'Modules/OtpVerification/OtpVerification.tsx';

const AppContent = () => {
  return (
    <Routes>
      <Route path="/credit-calculator" element={<CreditCalculator />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/loading" element={<Loader />} />
    </Routes>
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
