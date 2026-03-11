import { Route, Routes, BrowserRouter } from 'react-router-dom';

import ApplicationSuccess from 'Modules/ApplicationSuccess/ApplicationSuccess.tsx';
import CreditCalculator from 'Modules/CreditCalculator/CreditCalculator.tsx';
import Loader from 'Modules/Loader/Loader.tsx';
import OtpVerification from 'Modules/OtpVerification/OtpVerification.tsx';
import PassportCamera from 'Modules/PassportCamera/PassportCamera.tsx';
import ServiceUnavailable from 'Modules/ServiceUnavailable/ServiceUnavailable.tsx';

const AppContent = () => {
  return (
    <Routes>
      <Route path="/credit-calculator" element={<CreditCalculator />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/loading" element={<Loader />} />
      <Route path="/application-success" element={<ApplicationSuccess />} />
      <Route path="/service-unavailable" element={<ServiceUnavailable />} />
      <Route path="/passport" element={<PassportCamera />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
