import { useCallback, useEffect, useState } from 'react'
import { getFollowers, getFollowing, unfollowUser } from '../api/friendsApi'
import { addGroupToFriend, removeGroupFromFriend } from '../api/groupsApi'

import type { FollowerUser, FollowingUser, FollowerGroup } from '../types/friendship.types'

type FollowerListSetter = React.Dispatch<React.SetStateAction<FollowerUser[]>>


export default function useFollows() {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const [followers, setFollowers] = useState<FollowerUser[]>([])
    const [following, setFollowing] = useState<FollowingUser[]>([])

    const load = useCallback(async (): Promise<void> => {
        setLoading(true)
        setError(null)

        try {
            const [followersRes, followingRes] = 
            await Promise.all([
                getFollowers(),
                getFollowing()
            ])

            setFollowers(followersRes)
            setFollowing(followingRes)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Ошибка загрузки подписчиков и подписок')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])



    const updateFriend = (listSetter: FollowerListSetter, friendId: number, updater: (friend: FollowerUser) => FollowerUser) => {
        listSetter(prev =>
            prev.map(friend =>
                friend.id === friendId
                    ? updater(friend)
                    : friend
            )
        )
    }

    const addGroup = useCallback(async (friendId: number, group: FollowerGroup): Promise<void> => {
        
        updateFriend(setFollowers, friendId, (friend) => {
            const hasGroup = friend.groups?.some(g => g.id === group.id)

            return {
                ...friend,
                groups: hasGroup
                    ? friend.groups
                    : [...(friend.groups || []), group]
            }
        })

        try {
            await addGroupToFriend(group.id, friendId)
        } catch (e) {
            console.error(e)
            await load()
        }
    }, [load])

    const removeGroup = useCallback(async (friendId: number, group: FollowerGroup): Promise<void> => {

        updateFriend(setFollowers, friendId, (friend) => ({
            ...friend,
            groups: friend.groups.filter(g => Number(g.id) !== Number(group.id))
        }))

        try {
            await removeGroupFromFriend(group.id, friendId)
        } catch (e) {
            console.error(e)
            await load()
        }
    }, [load])


    const unfollow = useCallback(async (userId: number): Promise<void> => {
        await unfollowUser(userId)
        await load()
    }, [load])

    return {
        load,
        followers,
        following,
        loading,
        error,        
        addGroup,
        removeGroup,
        unfollow
    }
}