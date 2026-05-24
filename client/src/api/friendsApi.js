import { getAccessToken, handleResponse } from './apiClient'

const BASE_URL = import.meta.env.VITE_API_URL + '/api/friends'



export const getFollowers = async () => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/followers`,
        {
            method: 'GET',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include'
        }
    )

    return handleResponse(res, 'Ошибка получения списка подписчиков')
}

export const getFollowing = async () => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/following`,
        {
            method: 'GET',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include'
        }
    )

    return handleResponse(res, 'Ошибка получения списка подписок')
}

export const removeFollower = async (userId) => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/follower/${userId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include'
        }
    )

    return handleResponse(res, 'Ошибка удаления подписчика')
}
export const followUser = async (userId) => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/following/${userId}`,
        {
            method: 'POST',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include'
        }
    )

    return handleResponse(res, 'Ошибка подписки')
}

export const unfollowUser = async (userId) => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/following/${userId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include'
        }
    )

    return handleResponse(res, 'Ошибка удаления подписки')
}
