
import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorId: number | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps ) {
    super(props);
    this.state = { hasError: false, errorId: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      errorId: Date.now()
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Ошибка перехвачена ErrorBoundary:', error, info);
  }

  reset = (): void => {
    this.setState({ hasError: false, errorId: null });
  };

  reloadPage = ():void => {
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