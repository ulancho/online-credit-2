import styles from './LoanSummary.module.css';

interface LoanSummaryProps {
  monthlyPayment: string;
  originalRate: string;
  discountedRate: string;
  overpayment: string;
}

function GoldBadgeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M10.1018 1.41641C11.2809 0.755728 12.7186 0.755729 13.8976 1.41641L20.4076 5.06439C21.6331 5.75114 22.392 7.04639 22.392 8.45123V15.5487C22.392 16.9535 21.6331 18.2488 20.4076 18.9355L13.8976 22.5835C12.7186 23.2442 11.2809 23.2442 10.1018 22.5835L3.59189 18.9355C2.36635 18.2488 1.60742 16.9535 1.60742 15.5487V8.45123C1.60742 7.04639 2.36635 5.75114 3.59189 5.06439L10.1018 1.41641Z"
        fill="url(#g1)"
      />
      <path
        d="M10.4531 2.97975C11.4145 2.44381 12.5849 2.44381 13.5464 2.97975L19.2339 6.15023C20.2401 6.71112 20.8638 7.77279 20.8638 8.92474V15.0752C20.8638 16.2271 20.2401 17.2888 19.2339 17.8497L13.5464 21.0202C12.5849 21.5561 11.4145 21.5561 10.4531 21.0202L4.76555 17.8497C3.75937 17.2888 3.1357 16.2271 3.1357 15.0752V8.92474C3.1357 7.77279 3.75936 6.71112 4.76555 6.15023L10.4531 2.97975Z"
        fill="url(#g2)"
      />
      <path
        d="M10.8006 3.84212C11.5464 3.42808 12.4531 3.42808 13.1989 3.84212L18.6753 6.88235C19.46 7.31798 19.9468 8.1449 19.9468 9.04241V14.9575C19.9468 15.855 19.46 16.6819 18.6753 17.1176L13.1989 20.1578C12.453 20.5718 11.5464 20.5718 10.8006 20.1578L5.32411 17.1176C4.53941 16.6819 4.05267 15.855 4.05267 14.9575V9.04241C4.05267 8.1449 4.53941 7.31798 5.32411 6.88235L10.8006 3.84212Z"
        fill="#F8C52C"
      />
      <path
        d="M12.3476 7.62504L13.5029 9.97548L16.0861 10.3472C16.4022 10.3909 16.5221 10.7845 16.2932 11.0031L14.4294 12.8397L14.8763 15.4197C14.9308 15.7368 14.6038 15.9773 14.3204 15.8242L12.0097 14.6107L9.69906 15.8352C9.41567 15.9882 9.08869 15.7477 9.14319 15.4307L9.59006 12.8507L7.70447 11.014C7.47559 10.7954 7.60638 10.4018 7.91156 10.3581L10.5056 9.97548L11.6609 7.62504C11.8026 7.34081 12.2059 7.34081 12.3476 7.62504Z"
        fill="#CF9C02"
      />
      <defs>
        <linearGradient
          id="g1"
          x1="8.48468"
          y1="0.920898"
          x2="19.505"
          y2="22.2819"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFE598" />
          <stop offset="1" stopColor="#E2AC0A" />
        </linearGradient>
        <linearGradient
          id="g2"
          x1="7.16193"
          y1="-2.04671"
          x2="14.4937"
          y2="22.7119"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BD8618" />
          <stop offset="1" stopColor="#FFE14B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function LoanSummary({
  monthlyPayment,
  originalRate,
  discountedRate,
  overpayment,
}: LoanSummaryProps) {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Ежемесячный платёж</span>
        <span className={styles.rowValueBold}>
          {monthlyPayment} {'\u20C0'}
        </span>
      </div>

      <div className={styles.row}>
        <div className={styles.rateLabel}>
          <span className={styles.rowLabelMuted}>Ставка</span>
          <GoldBadgeIcon />
        </div>
        <div className={styles.rateValues}>
          <span className={styles.originalRate}>{originalRate}</span>
          <span className={styles.discountedRate}>{discountedRate}</span>
        </div>
      </div>

      <div className={styles.row}>
        <span className={styles.rowLabelMuted}>Переплата</span>
        <span className={styles.rowValue}>
          {overpayment} {'\u20C0'}
        </span>
      </div>
    </div>
  );
}
