import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.text}>
        Страница не найдена
      </p>

      <Link to="/" className={styles.link}>
        На главную
      </Link>
    </div>
  );
}