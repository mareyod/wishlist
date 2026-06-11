import styles from './styles/AppLoader.module.css'

export default function AppLoader() {
    return (
        <div className={styles.state}>
            <div className={styles.loader} />
            <p className={styles.text}>
                Загрузка...
            </p>
        </div>
    )
}