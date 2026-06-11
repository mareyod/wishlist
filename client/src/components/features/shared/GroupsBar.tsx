import { useState } from 'react'

import styles from './GroupsBar.module.css'
import GroupForm from './GroupForm'

import type { FriendshipGroup } from '../../../types/group.types'


const DEFAULT_COLOR = '#FADADD'

const COLORS = [
    DEFAULT_COLOR,
    '#D6F5D6',
    '#D6E4FF',
    '#FFF3BF',
    '#E6D6FF'
]

interface GroupsBarProps {
    groups?: FriendshipGroup[];
    selected: number | null;
    onSelect: (groupId: number | null) => void;
    onCreate: (name: string, color: string) => void;
    onDelete?: (groupId: number) => void;
    onEdit: (groupId: number, name: string, color: string) => void;
    maxGroups?: number;
    allLabel?: string;
}

export default function GroupsBar({
    groups = [],
    selected,
    onSelect,
    onCreate,
    onDelete,
    onEdit,
    maxGroups = 5,
    allLabel = 'Все'
}: GroupsBarProps) {


    const [creating, setCreating] = useState<boolean>(false)
    const [value, setValue] = useState<string>('')
    const [color, setColor] = useState<string>(DEFAULT_COLOR)


    const [editingId, setEditingId] = useState<number | null>(null)
    const [editValue, setEditValue] = useState<string>('')
    const [editColor, setEditColor] = useState<string>(DEFAULT_COLOR)


    const maxReached = groups.length >= maxGroups

    const resetCreate = () => {
        setCreating(false)
        setValue('')
        setColor(DEFAULT_COLOR)
    }

    const isSelected = (groupId: number): boolean => {
        return selected === groupId
    }


    const handleCreate = (): void => {
        const trimmed = value.trim()
        if (!trimmed || maxReached) {
            return
        }
        onCreate(trimmed, color)
        resetCreate()
    }

    const startEdit = (group: FriendshipGroup): void => {
        setEditingId(group.id)
        setEditValue(group.name)
        setEditColor(group.color)
    }

    const stopEdit = (): void => {
        setEditingId(null)
        setEditValue('')
        setEditColor(DEFAULT_COLOR)
    }

    const handleEditSubmit = (): void => {
        if (editingId === null) {
            return
        }
        const trimmed = editValue.trim()
        if (!trimmed) {
            return
        }
        onEdit(editingId, trimmed, editColor)
        stopEdit()
    }


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
                                        ✎
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