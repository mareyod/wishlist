import { useCallback, useState } from 'react'
import { followUser, unfollowUser } from '../api/friendsApi'

export default function useFollowUser({ userId, refresh }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const follow = useCallback(async () => {
        if (!userId) return

        setLoading(true)
        setError(null)

        try {
            await followUser(userId)
            await refresh?.()
        } catch (e) {
            setError(e)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [userId, refresh])

    const unfollow = useCallback(async () => {
        if (!userId) return

        setLoading(true)
        setError(null)

        try {
            await unfollowUser(userId)
            await refresh?.()
        } catch (e) {
            setError(e)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [userId, refresh])

    return {
        follow,
        unfollow,
        loading,
        error
    }
}