import type { ReserveWishResponse, UnreserveWishResponse } from '../types/api-responses.types';
import { getAccessToken, handleResponse } from './apiClient'

const BASE_URL = import.meta.env.VITE_API_URL + '/api/reservations'


export const reserveWish = async (itemId: number): Promise<ReserveWishResponse>  => {

  const token = getAccessToken()

  const res = await fetch(`${BASE_URL}/${itemId}`, {
    method: 'POST',
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    },
    credentials: 'include'
  })

  return handleResponse<ReserveWishResponse>(res, 'Ошибка установки брони')
}


export const unreserveWish = async (itemId: number): Promise<UnreserveWishResponse> => {
  const token = getAccessToken()

  const res = await fetch(`${BASE_URL}/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    },
    credentials: 'include'
  })

  return handleResponse<UnreserveWishResponse>(res, 'Ошибка снятия брони')
}