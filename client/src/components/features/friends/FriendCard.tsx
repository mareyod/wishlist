import styles from './FriendCard.module.css'
import { Link } from 'react-router-dom'
import type { Dispatch, SetStateAction } from 'react'

import FriendGroupsPicker from './FriendGroupsPicker'

import type { FriendUser, FollowerUser } from '../../../types/friendship.types'
import type { FriendshipGroup } from '../../../types/group.types'

const API_URL = import.meta.env.VITE_API_URL

interface FriendCardProps {
    friend: FriendUser;
    type: 'incoming' | 'outcoming';
    onRemove?: ((userId: number) => void | Promise<void>) | undefined;
    groups?: FriendshipGroup[] | undefined;
    onAddGroup?: ((friendId: number, group: FriendshipGroup) => void | Promise<void>) | undefined;
    onRemoveGroup?: ((friendId: number, group: FriendshipGroup) => void | Promise<void>) | undefined;
    openPickerId: number | null;
    setOpenPickerId: Dispatch<SetStateAction<number | null>>;
}
function isFollower(friend: FriendUser): friend is FollowerUser {
    return 'friendship_id' in friend
}

export default function FriendCard({
    friend,
    type,
    onRemove,
    groups,
    onAddGroup,
    onRemoveGroup,
    openPickerId,
    setOpenPickerId
}: FriendCardProps) {

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

                    <div className={styles.info}>
                        <div className={styles.nickname}>
                            {friend.nickname}
                        </div>
                        {canEditGroups && isFollower(friend) && onAddGroup && onRemoveGroup && (
                            <FriendGroupsPicker
                                friend={friend}
                                groups={groups}
                                onAddGroup={onAddGroup}
                                onRemoveGroup={onRemoveGroup}
                                open={openPickerId === friend.id}
                                onToggleOpen={setOpenPickerId}
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