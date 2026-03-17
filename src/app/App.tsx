import { Route, Routes, BrowserRouter } from 'react-router-dom';

import ApplicationSuccess from 'Modules/ApplicationSuccess/ApplicationSuccess.tsx';
import CoolingPeriod from 'Modules/CoolingPeriod/CoolingPeriod.tsx';
import CreditCalculator from 'Modules/CreditCalculator/CreditCalculator.tsx';
import InsuranceCompanies from 'Modules/InsuranceCompanies/InsuranceCompanies.tsx';
import Loader from 'Modules/Loader/Loader.tsx';
import LoanConditions from 'Modules/LoanConditions/LoanConditions.tsx';
import LoanConfirmation from 'Modules/LoanConfirmation/LoanConfirmation.tsx';
import OtpVerification from 'Modules/OtpVerification/OtpVerification.tsx';
import PassportCamera from 'Modules/PassportCamera/PassportCamera.tsx';
import PassportConfirmation from 'Modules/PassportConfirmation/PassportConfirmation.tsx';
import SecurityRemember from 'Modules/SecurityRemember/SecurityRemember.tsx';
import SecurityWarning from 'Modules/SecurityWarning/SecurityWarning.tsx';
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
      <Route path="/passport-confirmation" element={<PassportConfirmation />} />
      <Route path="/loan-conditions" element={<LoanConditions />} />
      <Route path="/insurance-companies" element={<InsuranceCompanies />} />
      <Route path="/loan-confirmation" element={<LoanConfirmation />} />
      <Route path="/security-warning" element={<SecurityWarning />} />
      <Route path="/security-remember" element={<SecurityRemember />} />
      <Route path="/cooling-period" element={<CoolingPeriod />} />
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
