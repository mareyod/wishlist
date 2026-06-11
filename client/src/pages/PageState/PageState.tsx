import type { ReactNode } from 'react'
import styles from './PageState.module.css'

interface PageStateProps {
    loading?: boolean;
    error?: string | null;
    isEmpty?: boolean;
    emptyText?: string;
    retryText?: string;
    onRetry?: () => void;
    children: ReactNode;
}

export default function PageState({
    loading,
    error,
    isEmpty,
    emptyText = 'Ничего не найдено',
    retryText = 'Попробовать снова',
    onRetry,
    children
}: PageStateProps) {

    if (loading) {
        return (
            <div className={styles.state}>
                <div className={styles.loader} />
                <p className={styles.text}>
                    Загрузка...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.state}>

                <h2 className={styles.title}>
                    Что-то пошло не так
                </h2>

                <p className={styles.text}>
                    {error}
                </p>

                {onRetry && (
                    <button
                        className={styles.button}
                        onClick={onRetry}
                    >
                        {retryText}
                    </button>
                )}
            </div>
        )
    }

    if (isEmpty) {
        return (
            <div className={styles.state}>
                <h2 className={styles.title}>
                    {emptyText}
                </h2>
            </div>
        )
    }

    return children
}