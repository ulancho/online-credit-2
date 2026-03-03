import { Route, Routes, BrowserRouter } from 'react-router-dom';

import CreditCalculator from 'Modules/CreditCalculator/CreditCalculator.tsx';

const AppContent = () => {
  return (
    <Routes>
      <Route path="/credit-calculator" element={<CreditCalculator />} />
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
