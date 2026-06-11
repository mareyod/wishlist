import type { Dispatch, SetStateAction } from 'react'
import styles from './FriendGroupsPicker.module.css'

import type { FollowerUser } from '../../../types/friendship.types'
import type { FriendshipGroup } from '../../../types/group.types'

interface FriendGroupsPickerProps {
    friend: FollowerUser;
    groups: FriendshipGroup[];
    onAddGroup: (friendId: number, group: FriendshipGroup) => void | Promise<void>;
    onRemoveGroup: (friendId: number, group: FriendshipGroup) => void | Promise<void>;
    open: boolean;
    onToggleOpen: Dispatch<SetStateAction<number | null>>;
}

export default function FriendGroupsPicker({
    friend, 
    groups, 
    onAddGroup, 
    onRemoveGroup,
    open,
    onToggleOpen
}: FriendGroupsPickerProps) {
    
    const friendGroups = friend.groups
    const friendGroupIds = friendGroups.map(group => Number(group.id))

    const handleToggle = (group: FriendshipGroup): void => {
        const id = Number(group.id)
        const hasGroup = friendGroupIds.includes(id)

        if (hasGroup) {
            onRemoveGroup(friend.id, group)
        } else {
            onAddGroup(friend.id, group)
        }

    }

    const handleToggleOpen = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        e.stopPropagation()

        onToggleOpen(prev =>
            prev === friend.id ? null : friend.id
        )
    }

    return (
        <div  className={styles.wrapper}>
            <div className={styles.tags}>
                        {friendGroups.map(group => (
                        <div
                            key={group.id}
                            className={styles.tag}
                            style={{ background: group.color }}
                        >
                            {group.name}
                        </div>
                    ))}

                    <button
                        className={styles.addButton}
                        onClick={handleToggleOpen}
                    >
                        ✎
                    </button>
            </div>
            {open && (
                <div 
                    className={styles.dropdown} 
                    onClick={(e) => { 
                        e.stopPropagation()
                    }}>
                    {groups.map(group => {
                        const active = friendGroupIds.includes(Number(group.id))
                        
                        return (
                            <div className={styles.option} key={group.id}>
                                <div
                                    className={styles.color}
                                    style={{ background: group.color }}
                                />

                                <span>{group.name}</span>
                                <button
                                    className={styles.addButton}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleToggle(group)
                                    }}
                                >
                                    <span className={styles.check}>
                                        {active ? '-' : '+'}
                                    </span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

        </div>
    )
}

