import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string | undefined;
}

export default function EmptyState({
    icon,
    title,
    description
}: EmptyStateProps) {

    return (
        <div className={styles.emptyState}>

            {icon && (
                <div className={styles.icon}>
                    {icon}
                </div>
            )}

            <h2 className={styles.title}>
                {title}
            </h2>

            {description && (
                <p className={styles.description}>
                    {description}
                </p>
            )}

        </div>
    )
}