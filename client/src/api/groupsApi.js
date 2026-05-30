import { getAccessToken, handleResponse } from './apiClient'

const BASE_URL = import.meta.env.VITE_API_URL + '/api/groups'


export const getGroups = async () => {
    const token = getAccessToken();

    const res = await fetch(
        BASE_URL,
        {
            method: 'GET',
            headers: { Authorization: token ? `Bearer ${token}` : undefined},
            credentials: 'include'
        }
    );

    return handleResponse(res, 'Ошибка получения групп');
};



export const createGroup = async (name, color)=> {
    const token = getAccessToken()

    const res = await fetch(
        BASE_URL,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include',
            body: JSON.stringify({name, color})
        }
    )

    return handleResponse(res, 'Ошибка создания группы')
}

export const updateGroup = async (groupId, name, color) => {
    const token = getAccessToken()
    const res = await fetch(
        `${BASE_URL}/${groupId}`,
        {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include',
            body: JSON.stringify({name, color})
        }
    )

    return handleResponse(res, 'Ошибка обновления группы')
}

export const deleteGroup = async (groupId) => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/${groupId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include'
        }
    )

    return handleResponse(res, 'Ошибка удаления группы')
}

export const addGroupToFriend= async (groupId, friendId) => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/${groupId}/friends/${friendId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include'
        }
    )

    return handleResponse(res, 'Ошибка присвоения группы подписчику')
}

export const removeGroupFromFriend = async (groupId, friendId) => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/${groupId}/friends/${friendId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            },

            credentials: 'include'
        }
    )

    return handleResponse(res, 'Ошибка удаления группы у подписчика')
}

export const addGroupToWishlistItem = async (groupId, wishId) => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/${groupId}/wishes/${wishId}`,
        {
            method: 'POST',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include'
        }
    )

    return handleResponse(res, 'Ошибка присвоения группы желанию')
}

export const removeGroupFromWishlistItem = async (groupId, wishId) => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/${groupId}/wishes/${wishId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include'
        }
    )

    return handleResponse(res, 'Ошибка удаления группы у желания')
}