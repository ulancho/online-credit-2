import { Route, Routes, BrowserRouter } from 'react-router-dom';

import ErrorPage from 'Common/components/ErrorPage/ErrorPage.tsx';
import ApplicationDecline from 'Modules/ApplicationDecline/ApplicationDecline.tsx';
import ApplicationStatusRedirect from 'Modules/ApplicationStatusRedirect/ApplicationStatusRedirect.tsx';
import ApplicationSuccess from 'Modules/ApplicationSuccess/ApplicationSuccess.tsx';
import Cooling from 'Modules/Cooling/Cooling.tsx';
import CoolingPeriod from 'Modules/CoolingPeriod/CoolingPeriod.tsx';
import CreditCalculator from 'Modules/CreditCalculator/CreditCalculator.tsx';
import DataFillStep1 from 'Modules/DataFillStep1/DataFillStep1.tsx';
import DataFillStep2 from 'Modules/DataFillStep2/DataFillStep2.tsx';
import DataFillStep3 from 'Modules/DataFillStep3/DataFillStep3.tsx';
import DataFillSuccess from 'Modules/DataFillSuccess/DataFillSuccess.tsx';
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
      {/*<Route path="/" element={<Test />} />*/}
      <Route path="/" element={<ApplicationStatusRedirect />} />
      <Route path="/credit-calculator" element={<CreditCalculator />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/loading" element={<Loader />} />
      <Route path="/application-success" element={<ApplicationSuccess />} />
      <Route path="/service-unavailable" element={<ServiceUnavailable />} />
      <Route path="/passport" element={<PassportCamera />} />
      <Route path="/passport-confirmation" element={<PassportConfirmation />} />
      <Route path="/loan-conditions" element={<LoanConditions />} />
      <Route path="/insurance-companies" element={<InsuranceCompanies />} />
      <Route path="/loan-confirmation/:type" element={<LoanConfirmation />} />
      <Route path="/security-warning" element={<SecurityWarning />} />
      <Route path="/security-remember" element={<SecurityRemember />} />
      <Route path="/cooling-period" element={<CoolingPeriod />} />
      <Route path="/data-fill" element={<DataFillStep1 />} />
      <Route path="/data-fill-2" element={<DataFillStep2 />} />
      <Route path="/data-fill-3" element={<DataFillStep3 />} />
      <Route path="/data-fill-success" element={<DataFillSuccess />} />
      <Route path="/application-decline" element={<ErrorPage />} />
      <Route path="/declined" element={<ApplicationDecline />} />
      <Route path="/cooling" element={<Cooling />} />
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
