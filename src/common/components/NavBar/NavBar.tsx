import styles from './NavBar.module.css';

interface NavBarProps {
  title: string;
  description?: string;
  onBack?: () => void;
}

export default function NavBar({ title, description, onBack }: NavBarProps) {
  return (
    <div className={styles.navbar}>
      <div className={styles.toolbar}>
        <button className={styles.backButton} onClick={onBack} aria-label="Назад">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5.74023 11.9492C5.74023 12.2812 5.86719 12.5645 6.13086 12.8184L13.748 20.2695C13.9531 20.4844 14.2266 20.5918 14.5391 20.5918C15.1738 20.5918 15.6719 20.1035 15.6719 19.459C15.6719 19.1465 15.5449 18.8633 15.3301 18.6484L8.46484 11.9492L15.3301 5.25C15.5449 5.02539 15.6719 4.74219 15.6719 4.42969C15.6719 3.79492 15.1738 3.30664 14.5391 3.30664C14.2266 3.30664 13.9531 3.41406 13.748 3.62891L6.13086 11.0801C5.86719 11.334 5.75 11.6172 5.74023 11.9492Z"
              fill="#129958"
            />
          </svg>
        </button>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>
    </div>
  );
}
