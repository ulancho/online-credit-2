// import InfoNotification from '../../components/InfoNotification/InfoNotification';
// import InputField from '../../components/InputField/InputField';
// import InsuranceToggle from '../../components/InsuranceToggle/InsuranceToggle';
// import LoanSummary from '../../components/LoanSummary/LoanSummary';
// import LoanTermSlider from '../../components/LoanTermSlider/LoanTermSlider';
// import TermsCheckbox from '../../components/TermsCheckbox/TermsCheckbox';
import NavBar from 'Common/components/NavBar/NavBar.tsx';
import { useTranslation } from 'Common/i18n';

import styles from './CreditCalculator.module.scss';

export default function CreditCalculator() {
  const { t } = useTranslation();
  return (
    <div className={styles.page}>
      <NavBar
        title={t('credit-calculator.title')}
        description={t('credit-calculator.description')}
      />
    </div>
  );
}
