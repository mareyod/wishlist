import FriendCard from './FriendCard'
import EmptyState from '../shared/EmptyState'

import styles from './FriendsSection.module.css'

export default function FriendsSection({
    title,
    items,
    type,
    onRemove,
    groups,
    onAddGroup,
    onRemoveGroup,
    children
}) {
    const hasItems = items?.length > 0
    const canRemove = type === 'outcoming'
    const canEditGroups = type === 'incoming'

    const emptyState = {
        incoming: {
            title: 'Нет подписчиков',
        },
        outcoming: {
            title: 'Нет подписок',
            description: 'Вы пока ни на кого не подписаны'
        }
    }


    return (
        <section className={styles.section}>

            <h2 className={styles.title}>
                {title}
            </h2>
            {children}
            {!hasItems && (
                <EmptyState
                    title={emptyState[type].title}
                    description={emptyState[type].description}
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
                        />
                    )
                })}

            </div>

        </section>
    )
}