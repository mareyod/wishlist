import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFollowers, getFollowing, unfollowUser } from '../api/friendsApi'
import { addGroupToFriend, removeGroupFromFriend } from '../api/groupsApi'

import type { FollowerUser, FollowingUser, FollowerGroup } from '../types/friendship.types'

type FollowerListSetter = React.Dispatch<React.SetStateAction<FollowerUser[]>>

const FOLLOWERS_KEY = ['followers']
const FOLLOWING_KEY = ['following']

export default function useFollows() {

    const queryClient = useQueryClient()
    const followersQuery = useQuery({
        queryKey: FOLLOWERS_KEY,
        queryFn: getFollowers,
    })
 
    const followingQuery = useQuery({
        queryKey: FOLLOWING_KEY,
        queryFn: getFollowing,
    })

    const patchFollowerInCache = (friendId: number, updater: (friend: FollowerUser) => FollowerUser) => {
        queryClient.setQueryData<FollowerUser[]>(['followers'], (old) =>
            (old ?? []).map((friend) =>
                friend.id === friendId ? updater(friend) : friend
            )
        )
    }

    const addGroupMutation = useMutation({
        mutationFn: ({ friendId, group }: { friendId: number; group: FollowerGroup }) =>

            addGroupToFriend(group.id, friendId),
            onMutate: async ({ friendId, group }) => {
                await queryClient.cancelQueries({ queryKey: FOLLOWERS_KEY })
 
                const previous = queryClient.getQueryData<FollowerUser[]>(FOLLOWERS_KEY)
 
                patchFollowerInCache(friendId, (friend) => {
                    const hasGroup = friend.groups?.some((g) => g.id === group.id)
                    return {
                        ...friend,
                        groups: hasGroup ? friend.groups : [...(friend.groups || []), group],
                    }
                })
                return { previous }
            },
 
            onError: (_err, _vars, context) => {
                if (context?.previous) {
                    queryClient.setQueryData(FOLLOWERS_KEY, context.previous)
                }
            },
 
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: FOLLOWERS_KEY })
            },
    })

    const removeGroupMutation = useMutation({
        mutationFn: ({ friendId, group }: { friendId: number; group: FollowerGroup }) =>
            removeGroupFromFriend(group.id, friendId),
 
        onMutate: async ({ friendId, group }) => {
            await queryClient.cancelQueries({ queryKey: FOLLOWERS_KEY })
            const previous = queryClient.getQueryData<FollowerUser[]>(FOLLOWERS_KEY)
 
            patchFollowerInCache(friendId, (friend) => ({
                ...friend,
                groups: friend.groups.filter((g) => Number(g.id) !== Number(group.id)),
            }))
 
            return { previous }
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(FOLLOWERS_KEY, context.previous)
            }
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: FOLLOWERS_KEY })
        },
    })


    const unfollowMutation = useMutation({
        mutationFn: (userId: number) => unfollowUser(userId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: FOLLOWERS_KEY })
            void queryClient.invalidateQueries({ queryKey: FOLLOWING_KEY })
        },
    })

    const addGroup = async (friendId: number, group: FollowerGroup): Promise<void> => {
        await addGroupMutation.mutateAsync({ friendId, group })
    }
 
    const removeGroup = async (friendId: number, group: FollowerGroup): Promise<void> => {
        await removeGroupMutation.mutateAsync({ friendId, group })
    }
 
    const unfollow = async (userId: number): Promise<void> => {
        await unfollowMutation.mutateAsync(userId)
    }
 
    const load = async (): Promise<void> => {
        await Promise.all([followersQuery.refetch(), followingQuery.refetch()])
    }
 
    const error =
        followersQuery.error instanceof Error ? followersQuery.error.message :
        followingQuery.error instanceof Error ? followingQuery.error.message :
        null

    return {
        load,
        followers: followersQuery.data ?? [],
        following: followingQuery.data ?? [],
        loading: followersQuery.isLoading || followingQuery.isLoading,
        error,
        addGroup,
        removeGroup,
        unfollow
    }
}