import type { WishFormValues } from "../types/wish.types"
import type { WishlistResponse, CreateWishResponse, UpdateWishResponse, DeleteWishResponse } from '../types/api-responses.types';
import { fetchWithRefresh, getAccessToken, handleResponse } from './apiClient'

const BASE_URL = import.meta.env.VITE_API_URL + '/api/wishes'


export const getWishlist = async (nickname: string): Promise<WishlistResponse> => {
  const token = getAccessToken()
  
  const res = await fetchWithRefresh(`${BASE_URL}/${nickname}`, {
    headers: {
         Authorization: token ? `Bearer ${token}` : ''
    },
    method: 'GET',
    credentials: 'include'
  })

  return handleResponse<WishlistResponse>(res, 'Ошибка получения вишлиста')
}

export const createWish = async (wish: WishFormValues): Promise<CreateWishResponse>  => {
  const token = getAccessToken()
  const res = await fetchWithRefresh(BASE_URL, {
    headers: {
         Authorization: token ? `Bearer ${token}` : ''
    },
    method: 'POST',
    credentials: 'include',
    body: buildWishFormData(wish)
  })

  return handleResponse<CreateWishResponse>(res, 'Ошибка создания желания')
}

export const updateWish = async (id: number, wish: WishFormValues): Promise<UpdateWishResponse> => {
  const token = getAccessToken()
  const res = await fetchWithRefresh(
    `${BASE_URL}/${id}`,
    {
      headers: {
         Authorization: token ? `Bearer ${token}` : ''
      },
      method: 'PUT',
      credentials: 'include',
      body: buildWishFormData(wish)
    }
  )

  return handleResponse<UpdateWishResponse>(res, 'Ошибка обновления желания')
}

export const deleteWish = async (id: number): Promise<DeleteWishResponse> => {
  const token = getAccessToken()
  
  const res = await fetchWithRefresh(
    `${BASE_URL}/${id}`,
    {
      headers: {
         Authorization: token ? `Bearer ${token}` : ''
      },
      method: 'DELETE',
      credentials: 'include'
    }
  )

  return handleResponse<DeleteWishResponse>(res, 'Ошибка удаления желания')
}

function buildWishFormData(wish: WishFormValues): FormData {
  const formData = new FormData()

  formData.append(
    'title',
    wish.title || ''
  )

  formData.append(
    'description',
    wish.description || ''
  )

  formData.append(
    'external_link',
    wish.external_link || ''
  )

  formData.append(
    'price',
    wish.price === null ? '' : String(wish.price ?? '')
  )

  formData.append(
    'is_public',
    String(wish.is_public)
  )

  formData.append(
    'visibility_group_ids',
    JSON.stringify(wish.visibility_group_ids || [])
  )

  if (wish.image_file) {
    formData.append(
      'image',
      wish.image_file
    )
  }

  if (wish.remove_image) {
    formData.append(
      'remove_image',
      'true'
    )
  }
  return formData
}