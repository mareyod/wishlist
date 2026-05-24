import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>

      <main className={styles.hero}>
        <h1 className={styles.title}>
          Делитесь желаниями с теми, кто вам важен
        </h1>

        <p className={styles.subtitle}>
          Создавайте списки желаний, добавляйте подарки и делитесь ими с друзьями и семьёй.
          Управляйте приватностью и группами доступа легко и красиво.
        </p>
      </main>

      <section className={styles.features}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>🔒</div>
          <h3>Приватность</h3>
          <p>Контролируйте, кто видит ваши желания</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>👨‍👩‍👧‍👦</div>
          <h3>Группы друзей</h3>
          <p>Разделяйте доступ для семьи, друзей и коллег</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>🎁</div>
          <h3>Бронирование подарков</h3>
          <p>Друзья могут тайно резервировать подарки</p>
        </div>
      </section>

    </div>
  );
}