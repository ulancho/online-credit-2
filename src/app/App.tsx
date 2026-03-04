import { Route, Routes, BrowserRouter } from 'react-router-dom';

import CreditCalculator from 'Modules/CreditCalculator/CreditCalculator.tsx';
import OtpVerification from 'Modules/OtpVerification/OtpVerification.tsx';

const AppContent = () => {
  return (
    <Routes>
      <Route path="/credit-calculator" element={<CreditCalculator />} />
      <Route path="/otp" element={<OtpVerification />} />
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
