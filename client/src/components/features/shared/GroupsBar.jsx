import { useEffect, useRef, useState } from 'react'

import styles from './GroupsBar.module.css'
import GroupForm from './GroupForm'

const COLORS = [
    '#FADADD',
    '#D6F5D6',
    '#D6E4FF',
    '#FFF3BF',
    '#E6D6FF'
]

export default function GroupsBar({
    groups = [],
    selected,
    onSelect,
    onCreate,
    onDelete,
    onEdit,
    maxGroups = 5,
    allLabel = 'Все'
}) {


    const [creating, setCreating] = useState(false)
    const [value, setValue] = useState('')
    const [color, setColor] = useState(COLORS[0])


    const [editingId, setEditingId] = useState(null)
    const [editValue, setEditValue] = useState('')
    const [editColor, setEditColor] = useState(COLORS[0])

    const inputRef = useRef(null)

    const maxReached = groups.length >= maxGroups

    const resetCreate = () => {
        setCreating(false)
        setValue('')
        setColor(COLORS[0])
    }

    const isSelected = (groupId) => {
        return selected === groupId
    }


    const handleCreate = () => {
        const trimmed = value.trim()
        if (!trimmed || maxReached) {
            return
        }
        onCreate(trimmed, color)
        resetCreate()
    }

    const startEdit = (group) => {
        setEditingId(group.id)
        setEditValue(group.name)
        setEditColor(group.color)
    }

    const stopEdit = () => {
        setEditingId(null)
        setEditValue('')
        setEditColor(COLORS[0])
    }

    const handleEditSubmit = () => {
        const trimmed = editValue.trim()
        if (!trimmed) {
            return
        }
        onEdit(editingId, trimmed, editColor)
        stopEdit()
    }

    useEffect(() => {
        if (creating) {
            inputRef.current?.focus()
        }

    }, [creating])


    return (
        <div className={styles.bar}>
            <div className={styles.groupItem}>
                {creating ? (
                    <GroupForm
                        value={value}
                        setValue={setValue}
                        color={color}
                        setColor={setColor}
                        colors={COLORS}
                        onSubmit={handleCreate}
                        onCancel={resetCreate}
                    />
                ) : (
                    !maxReached && (
                        <button
                            className={styles.addButton}
                            onClick={() => setCreating(true)}
                        >
                            +
                        </button>
                    )
                )}
            </div>
            <button
                className={ selected === null ? styles.activeGroup : styles.groupButton}
                onClick={() => onSelect(null)}
            >
                {allLabel}
            </button>

            {groups.map(group => {

                const active = isSelected(group.id)
                const editing = editingId === group.id

                return (
                    <div key={group.id} className={styles.groupWrapper}>
                        {editing ? (
                            <GroupForm
                                value={editValue}
                                setValue={setEditValue}
                                color={editColor}
                                setColor={setEditColor}
                                colors={COLORS}
                                onSubmit={handleEditSubmit}
                                onCancel={stopEdit}
                            />
                        ) : (

                            <>
                                <button
                                    className={active ? styles.activeGroup : styles.groupButton}
                                    style={{
                                        backgroundColor: active ? '#111' : group.color,
                                        color: active ? '#fff' : '#222'
                                    }}

                                    onClick={() => onSelect(group.id)}
                                    onDoubleClick={() => startEdit(group)}
                                >
                                    {group.name}
                                </button>

                                <div className={styles.groupActions}>
                                    <button
                                        type="button"
                                        className={styles.editButton}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            startEdit(group)
                                        }}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDelete?.(group.id)
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            </>

                        )}

                    </div>

                )
            })}

        </div>
    )
}