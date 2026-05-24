import styles from './FriendCard.module.css'
import { Link } from 'react-router-dom'
const API_URL = import.meta.env.VITE_API_URL
import FriendGroupsPicker from './FriendGroupsPicker'

export default function FriendCard({
    friend,
    type,
    onRemove,
    groups,
    onAddGroup,
    onRemoveGroup
}) {

    const canEditGroups = type === 'incoming' && groups
    const canRemove = type === 'outcoming' && onRemove

    return (
        <Link
            to={`/users/${friend.nickname}`}
            className={styles.cardLink}
        >
            <div className={styles.card}>

                <div className={styles.left}>

                    <img
                        className={styles.avatar}
                        src={
                            friend.avatar_url
                                ? API_URL + friend.avatar_url
                                : '/img/avatar.png'
                        }
                    />

                    <div>

                        <div className={styles.nickname}>
                            {friend.nickname}
                        </div>

                        <div className={styles.status}>
                            @{friend.nickname}
                        </div>
                        {canEditGroups && (
                            <FriendGroupsPicker
                                friend={friend}
                                groups={groups}
                                onAddGroup={onAddGroup}
                                onRemoveGroup={onRemoveGroup}
                            />
                        )}
                    </div>

                </div>
                {canRemove && (
                    <button
                        className={styles.removeButton}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onRemove(friend.id)
                        }}
                    >
                        Удалить
                    </button>
                )}

            </div>
        </Link>
    )
}