import styles from './EmptyState.module.css'

export default function EmptyState({
    icon,
    title,
    description
}) {

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