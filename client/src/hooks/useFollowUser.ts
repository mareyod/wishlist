import { useCallback, useState } from 'react'
import { followUser, unfollowUser } from '../api/friendsApi'

interface UseFollowUserParams {
    userId: number | null | undefined;
    refresh?: () => void | Promise<void>;
}

export default function useFollowUser({ userId, refresh }: UseFollowUserParams) {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<unknown>(null)

    const follow = useCallback(async (): Promise<void> => {
        if (!userId) return

        setLoading(true)
        setError(null)

        try {
            await followUser(userId)
            await refresh?.()
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Не удалось подписаться')
        } finally {
            setLoading(false)
        }
    }, [userId, refresh])

    const unfollow = useCallback(async (): Promise<void> => {
        if (!userId) return

        setLoading(true)
        setError(null)

        try {
            await unfollowUser(userId)
            await refresh?.()
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Не удалось отписаться')
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