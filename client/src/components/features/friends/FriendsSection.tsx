import { useState, useEffect } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

import FriendCard from './FriendCard'
import EmptyState from '../shared/EmptyState'

import styles from './FriendsSection.module.css'

import type { FriendUser } from '../../../types/friendship.types'
import type { FriendshipGroup } from '../../../types/group.types'

type SectionType = 'incoming' | 'outcoming'

interface FriendsSectionProps {
    title: string;
    items: FriendUser[];
    type: SectionType;
    onRemove?: ((userId: number) => void | Promise<void>) | undefined;
    groups?: FriendshipGroup[] | undefined;
    onAddGroup?: ((friendId: number, group: FriendshipGroup) => void | Promise<void>) | undefined;
    onRemoveGroup?: ((friendId: number, group: FriendshipGroup) => void | Promise<void>) | undefined;
    children?: ReactNode;
}

const EMPTY_STATE: Record<SectionType, { title: string; description?: string }> = {
    incoming: {
        title: 'Нет подписчиков',
    },
    outcoming: {
        title: 'Нет подписок',
        description: 'Вы пока ни на кого не подписаны'
    }
}

export default function FriendsSection({
    title,
    items,
    type,
    onRemove,
    groups,
    onAddGroup,
    onRemoveGroup,
    children
}: FriendsSectionProps) {
    const [openPickerId, setOpenPickerId] = useState<number | null>(null)

    const hasItems = items?.length > 0
    const canRemove = type === 'outcoming'
    const canEditGroups = type === 'incoming'


    useEffect(() => {
        const handleClickOutside = (): void => {
            setOpenPickerId(null)
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])


    return (
        <section className={styles.section}>

            <h2 className={styles.title}>
                {title}
            </h2>
            {children}
            {!hasItems && (
                <EmptyState
                    title={EMPTY_STATE[type].title}
                    description={EMPTY_STATE[type].description}
                />
            )}

            <div className={styles.list}>
                {items?.map(item => {
                    return (
                        <FriendCard
                            key={item.id}
                            friend={item}
                            type={type}
                            onRemove={canRemove ? onRemove : undefined}
                            groups={canEditGroups ? groups : undefined}
                            onAddGroup={canEditGroups ? onAddGroup : undefined}
                            onRemoveGroup={canEditGroups ? onRemoveGroup : undefined}
                            openPickerId={openPickerId}
                            setOpenPickerId={setOpenPickerId}
                        />
                    )
                })}

            </div>

        </section>
    )
}