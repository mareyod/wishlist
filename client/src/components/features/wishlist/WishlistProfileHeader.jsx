import styles from './WishlistProfileHeader.module.css'

const API_URL = import.meta.env.VITE_API_URL

export default function WishlistProfileHeader({
    owner,
    viewer,
    onAddWish,
    onFollow,
    onUnfollow,
    followLoading
}) {

    const role = viewer?.role

    return (
        <section className={styles.header}>
            <div className={styles.userInfo}>
                <img className={styles.avatar} src={owner?.avatar_url ? `${API_URL}${owner.avatar_url}` : '/img/avatar.png'}/>
                <div className={styles.info}>
                    <h1 className={styles.nickname}>
                        {owner?.nickname}
                    </h1>
                </div>
            </div>

            <div className={styles.actions}>
                {role === 'owner' && (
                    <button className={styles.primaryButton} onClick={onAddWish}>
                        Добавить желание
                    </button>
                )}
                {role === 'guest' && (
                    <button className={styles.primaryButton} onClick={onFollow} disabled={followLoading} >
                        {followLoading ? (
                            <span className={styles.loader}></span>
                        ) : (
                            'Подписаться'
                        )}
                    </button>
                )}
                {role === 'friend' && (
                    <button className={styles.secondaryButton} onClick={onUnfollow} disabled={followLoading}>
                        {followLoading ? (
                            <span className={styles.loader}></span>
                        ) : (
                            'Отписаться'
                        )}
                    </button>
                )}

            </div>

        </section>
    )
}