import React, { useEffect, useState } from 'react'
import styles from './FriendGroupsPicker.module.css'

export default function FriendGroupsPicker({
    friend, 
    groups, 
    onAddGroup, 
    onRemoveGroup
}) {

    const [open, setOpen] = useState(false)
    
    const friendGroups = friend.groups
    const friendGroupIds = friendGroups.map(group => Number(group.id))

    const handleToggle = (group) => {

        const id = Number(group.id)
        const hasGroup = friendGroupIds.includes(id)

        if (hasGroup) {
            onRemoveGroup(friend.id, group)
        } else {
            onAddGroup(friend.id, group)
        }
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
                        onClick={(e) => {
                            e.preventDefault()
                            setOpen(prev => !prev)
                        }}
                    >
                        ✎
                    </button>
            </div>
            {open && (
                <div 
                    className={styles.dropdown} 
                    onClick={(e) => { 
                        e.preventDefault();
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

