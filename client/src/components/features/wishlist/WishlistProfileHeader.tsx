import { useRef, useState } from 'react'

import styles from './WishlistProfileHeader.module.css'
import { useAuth } from "../../../hooks/useAuth";

import type { UserDtoInterface } from '../../../types/user.types'
import type { ViewerContext } from '../../../types/friendship.types'

const API_URL = import.meta.env.VITE_API_URL
const MAX_FILE_SIZE = 8 * 1024 * 1024

interface WishlistProfileHeaderProps {
    owner?: UserDtoInterface | undefined;
    viewer?: ViewerContext | undefined;
    onAddWish: () => void;
    onFollow: () => void;
    onUnfollow: () => void;
    followLoading: boolean;
    onAvatarChanged?: () => void | Promise<void>;
}

export default function WishlistProfileHeader({
    owner,
    viewer,
    onAddWish,
    onFollow,
    onUnfollow,
    followLoading,
    onAvatarChanged
}: WishlistProfileHeaderProps) {

    const { changeAvatarApi } = useAuth(); 
    const role = viewer?.role

    const fileRef = useRef<HTMLInputElement>(null);

    const [avatarLoading, setAvatarLoading] = useState<boolean>(false)
    const [avatarError, setAvatarError] = useState<string | null>(null)

    const handleClickAvatar = (): void => {
        if (role === 'owner' && !avatarLoading) {
            fileRef.current?.click()
        }
    };
    
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {

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

        setAvatarError(null)
        setAvatarLoading(true)

        try {
            await changeAvatarApi(file)
            await onAvatarChanged?.()
        } catch (err) {
            setAvatarError(err instanceof Error ? err.message : 'Не удалось обновить аватар')
        } finally {
            setAvatarLoading(false)
            if (fileRef.current) {
                fileRef.current.value = ''
            }
        }
    }


    return (
        <section className={styles.header}>
            <div className={styles.userInfo}>
                <div className={styles.avatarWrapper} onClick={handleClickAvatar}>
                    <img
                        className={styles.avatar}
                        src={owner?.avatar_url ? `${API_URL}${owner.avatar_url}` : '/img/avatar.png'}
                    />
                    {avatarLoading && (
                        <div className={styles.avatarLoadingOverlay}>
                            <span className={styles.loader}></span>
                        </div>
                    )}
                </div>
                <div className={styles.info}>
                    <h1 className={styles.nickname}>
                        {owner?.nickname}
                    </h1>
                    {avatarError && (
                        <p className={styles.avatarError}>
                            {avatarError}
                        </p>
                    )}
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