import type { FollowerUser, FollowingUser } from "../types/friendship.types"
import type { SuccessResponse } from "../types/api-responses.types"
import { fetchWithRefresh, getAccessToken, handleResponse } from './apiClient'

const BASE_URL = import.meta.env.VITE_API_URL + '/api/friends'



export const getFollowers = async (): Promise<FollowerUser[]>  => {
    const token = getAccessToken()

    const res = await fetchWithRefresh(
        `${BASE_URL}/followers`,
        {
            method: 'GET',
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include'
        }
    )

    return handleResponse<FollowerUser[]>(res, 'Ошибка получения списка подписчиков')
}

export const getFollowing = async (): Promise<FollowingUser[]> => {
    const token = getAccessToken()

    const res = await fetchWithRefresh(
        `${BASE_URL}/following`,
        {
            method: 'GET',
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include'
        }
    )

    return handleResponse<FollowingUser[]>(res, 'Ошибка получения списка подписок')
}

export const removeFollower = async (userId: number): Promise<SuccessResponse> => {
    const token = getAccessToken()

    const res = await fetchWithRefresh(
        `${BASE_URL}/follower/${userId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include'
        }
    )

    return handleResponse<SuccessResponse>(res, 'Ошибка удаления подписчика')
}
export const followUser = async (userId: number): Promise<SuccessResponse> => {
    const token = getAccessToken()

    const res = await fetchWithRefresh(
        `${BASE_URL}/following/${userId}`,
        {
            method: 'POST',
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include'
        }
    )

    return handleResponse<SuccessResponse>(res, 'Ошибка подписки')
}

export const unfollowUser = async (userId: number): Promise<SuccessResponse> => {
    const token = getAccessToken()

    const res = await fetchWithRefresh(
        `${BASE_URL}/following/${userId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include'
        }
    )

    return handleResponse<SuccessResponse>(res, 'Ошибка удаления подписки')
}
