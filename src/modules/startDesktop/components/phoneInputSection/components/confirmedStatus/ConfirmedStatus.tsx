import confirmedIconUrl from 'Assets/icons/confirmed.svg';

import styles from './ConfirmedStatus.module.scss';

export function ConfirmedStatus() {
  return (
    <div className={styles.container}>
      <img src={confirmedIconUrl} alt="confirmed" className={styles.icon} />
      <p className={styles.title}>Вход одобрен</p>
      <p className={styles.subtitle}>
        Мы перенаправим вас на сайт Ticket.kg <br /> — это займёт всего пару секунд.
      </p>
    </div>
  );
}
