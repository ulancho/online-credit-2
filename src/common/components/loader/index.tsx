import styles from './style.module.scss';

interface Props {
  classes?: string;
}

export const Loader = ({ classes }: Props) => {
  return <span className={`${styles.loader} ${classes}`} aria-label="Ожидание подтверждения" />;
};
