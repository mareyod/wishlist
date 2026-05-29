import { useRef } from 'react'

import styles from './WishlistProfileHeader.module.css'
import { useAuth } from "../../../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL

export default function WishlistProfileHeader({
    owner,
    viewer,
    onAddWish,
    onFollow,
    onUnfollow,
    followLoading
}) {

    const { changeAvatarApi } = useAuth(); 
    const role = viewer?.role

    const fileRef = useRef(null);

    const handleClickAvatar = () => {
        if (role === 'owner') {
            fileRef.current.click();
        }
    };
    const MAX_FILE_SIZE = 8 * 1024 * 1024

    const handleAvatarChange = (e) => {

        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert('Можно загружать только изображения')
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            alert('Максимальный размер 8MB')
            return
        }

        changeAvatarApi(file) 
    }

    

    return (
        <section className={styles.header}>
            <div className={styles.userInfo}>
                <img className={styles.avatar} src={owner?.avatar_url ? `${API_URL}${owner.avatar_url}` : '/img/avatar.png'} onClick={handleClickAvatar}/>
                <div className={styles.info}>
                    <h1 className={styles.nickname}>
                        {owner?.nickname}
                    </h1>
                </div>
            </div>
            <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
            />

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