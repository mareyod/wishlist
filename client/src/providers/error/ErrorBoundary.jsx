
import React from 'react';
import styles from './ErrorBoundary.module.css';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorId: null };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorId: Date.now()
    };
  }

  componentDidCatch(error, info) {
    console.error('Ошибка перехвачена ErrorBoundary:', error, info);
  }

  reset = () => {
    this.setState({ hasError: false, errorId: null });
  };

  reloadPage = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <div className={styles.icon}>💔</div>

            <h1 className={styles.title}>
              Что-то пошло не так
            </h1>

            <div className={styles.actions}>
              <button className={styles.primaryButton} onClick={this.reset}>
                Попробовать снова
              </button>

              <button className={styles.secondaryButton} onClick={this.reloadPage}>
                Обновить страницу
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}