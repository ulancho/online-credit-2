import styles from './Spinner.module.scss';

interface Props {
  width?: number;
  height?: number;
}

function Spinner({ width = 48, height = 48 }: Props) {
  return (
    <div className={styles.uploadingScreen}>
      <div style={{ width, height }} className={styles.spinner} />
    </div>
  );
}

export default Spinner;
