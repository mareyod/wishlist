import type { FriendshipGroup } from '../types/group.types';
import type { SuccessResponse } from '../types/api-responses.types';
import { getAccessToken, handleResponse } from './apiClient'

const BASE_URL = import.meta.env.VITE_API_URL + '/api/groups'


export const getGroups = async (): Promise<FriendshipGroup[]> => {
    const token = getAccessToken();

    const res = await fetch(
        BASE_URL,
        {
            method: 'GET',
            headers: { Authorization: token ? `Bearer ${token}` : ''},
            credentials: 'include'
        }
    );

    return handleResponse<FriendshipGroup[]>(res, 'Ошибка получения групп');
};



export const createGroup = async (name: string, color: string): Promise<FriendshipGroup> => {
    const token = getAccessToken()

    const res = await fetch(
        BASE_URL,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include',
            body: JSON.stringify({name, color})
        }
    )

    return handleResponse<FriendshipGroup>(res, 'Ошибка создания группы')
}

export const updateGroup = async (groupId: number, name: string, color: string): Promise<FriendshipGroup> => {
    const token = getAccessToken()
    const res = await fetch(
        `${BASE_URL}/${groupId}`,
        {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include',
            body: JSON.stringify({name, color})
        }
    )

    return handleResponse<FriendshipGroup>(res, 'Ошибка обновления группы')
}

export const deleteGroup = async (groupId: number): Promise<SuccessResponse> => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/${groupId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include'
        }
    )

    return handleResponse<SuccessResponse>(res, 'Ошибка удаления группы')
}

export const addGroupToFriend= async (groupId: number, friendId: number): Promise<SuccessResponse> => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/${groupId}/friends/${friendId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include'
        }
    )

    return handleResponse<SuccessResponse>(res, 'Ошибка присвоения группы подписчику')
}

export const removeGroupFromFriend = async (groupId: number, friendId: number): Promise<SuccessResponse> => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/${groupId}/friends/${friendId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },

            credentials: 'include'
        }
    )

    return handleResponse<SuccessResponse>(res, 'Ошибка удаления группы у подписчика')
}

export const addGroupToWishlistItem = async (groupId: number, wishId: number): Promise<SuccessResponse> => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/${groupId}/wishes/${wishId}`,
        {
            method: 'POST',
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include'
        }
    )

    return handleResponse<SuccessResponse>(res, 'Ошибка присвоения группы желанию')
}

export const removeGroupFromWishlistItem = async (groupId: number, wishId: number): Promise<SuccessResponse> => {
    const token = getAccessToken()

    const res = await fetch(
        `${BASE_URL}/${groupId}/wishes/${wishId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include'
        }
    )

    return handleResponse<SuccessResponse>(res, 'Ошибка удаления группы у желания')
}