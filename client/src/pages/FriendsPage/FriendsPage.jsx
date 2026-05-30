    import FriendsSection from '../../components/features/friends/FriendsSection'
    import GroupsBar from '../../components/features/shared/GroupsBar'
    import PageState from '../PageState/PageState'
    import styles from './FriendsPage.module.css'

    import { useMemo } from 'react'

    import useFollows from '../../hooks/useFollows'
    import useGroups from '../../hooks/useGroups'

    export default function FriendsPage() {

        const {
            load,
            followers,
            following,
            loading,
            error,
            addGroup,
            removeGroup,
            unfollow
        } = useFollows()
        
        const {
            groups,
            selectedGroupId,
            setSelectedGroupId,
            handleCreateGroup,
            handleDeleteGroup,
            handleEditGroup

        } = useGroups()


        const filteredFollowers = useMemo(() => {
            if (!followers) return []
            if (!selectedGroupId) return followers

            return followers.filter(item =>
                item.groups?.some(group => Number(group.id) === Number(selectedGroupId))
            )
        }, [followers, selectedGroupId])

        return (
            <PageState
                loading={loading}
                error={error}
                isEmpty={!followers?.length && !following?.length}
                emptyText="У вас пока нет подписчиков и подписок"
                onRetry={load}
            >
                <div className={styles.wrapper}>
                    <div className={styles.container}>
                        <FriendsSection
                            title="Подписчики"
                            items={filteredFollowers}
                            type="incoming"
                            groups={groups}
                            onAddGroup={addGroup}
                            onRemoveGroup={removeGroup}
                        >
                            <GroupsBar
                                groups={groups}
                                selected={selectedGroupId}
                                onSelect={setSelectedGroupId}
                                onCreate={handleCreateGroup}
                                onDelete={handleDeleteGroup}
                                onEdit={handleEditGroup}
                            />
                        </FriendsSection>

                        <FriendsSection
                            title="Подписки"
                            items={following}
                            type="outcoming"
                            onRemove={unfollow}
                        />
                    </div>
                </div>
            </PageState>
        )
    }