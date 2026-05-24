import { getAccessToken, handleResponse } from './apiClient'

const BASE_URL = import.meta.env.VITE_API_URL + '/api/reservations'


export const reserveWish = async (itemId) => {

  const token = getAccessToken()

  const res = await fetch(`${BASE_URL}/${itemId}`, {
    method: 'POST',
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    },
    credentials: 'include'
  })

  return handleResponse(res, 'Ошибка установки брони')
}


export const unreserveWish = async (itemId) => {
  const token = getAccessToken()

  const res = await fetch(`${BASE_URL}/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    },
    credentials: 'include'
  })

  return handleResponse(res, 'Ошибка снятия брони')
}