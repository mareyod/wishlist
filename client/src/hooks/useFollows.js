import { useCallback, useEffect, useState } from 'react'
import { getFollowers, getFollowing, removeFollower, unfollowUser } from '../api/friendsApi'
import { addGroupToFriend, removeGroupFromFriend } from '../api/groupsApi'
export default function useFollows() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])

    const load = useCallback(async () => {
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
            setError(e?.message || 'Friends load error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])



    const updateFriend = (listSetter, friendId, updater) => {
        listSetter(prev =>
            prev.map(friend =>
                friend.id === friendId
                    ? updater(friend)
                    : friend
            )
        )
    }

    const addGroup = useCallback(async (friendId, group) => {

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

    const removeGroup = useCallback(async (friendId, group) => {

        updateFriend(setFollowers, friendId, (friend) => ({
            ...friend,
            groups: friend.groups.filter(g => g.id !== group.id)
        }))

        try {
            await removeGroupFromFriend(group.id, friendId)
        } catch (e) {
            console.error(e)
            await load()
        }
    }, [load])


    const removeFollower = useCallback(async (friendshipId) => {
        await removeFollower(friendshipId)
        await load()
    }, [load])

    const unfollow = useCallback(async (userId) => {
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