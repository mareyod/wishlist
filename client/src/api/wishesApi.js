import { getAccessToken, handleResponse } from './apiClient'

const BASE_URL = import.meta.env.VITE_API_URL + '/api/wishes'


export const getWishlist = async (nickname) => {
  const token = getAccessToken()
  
  const res = await fetch(`${BASE_URL}/${nickname}`, {
    headers: {
         Authorization: token ? `Bearer ${token}` : undefined
    },
    method: 'GET',
    credentials: 'include'
  })

  return handleResponse(res, 'Ошибка получения вишлиста')
}

export const createWish = async wish => {
  const token = getAccessToken()
  const res = await fetch(BASE_URL, {
    headers: {
         Authorization: token ? `Bearer ${token}` : undefined
    },
    method: 'POST',
    credentials: 'include',
    body: buildWishFormData(wish)
  })

  return handleResponse(res, 'Ошибка создания желания')
}

export const updateWish = async (id, wish) => {
  const token = getAccessToken()
  const res = await fetch(
    `${BASE_URL}/${id}`,
    {
      headers: {
         Authorization: token ? `Bearer ${token}` : undefined
      },
      method: 'PUT',
      credentials: 'include',
      body: buildWishFormData(wish)
    }
  )

  return handleResponse(res, 'Ошибка обновления желания')
}

export const deleteWish = async id => {
  const token = getAccessToken()
  
  const res = await fetch(
    `${BASE_URL}/${id}`,
    {
      headers: {
         Authorization: token ? `Bearer ${token}` : undefined
      },
      method: 'DELETE',
      credentials: 'include'
    }
  )

  return handleResponse(res, 'Ошибка удаления желания')
}

function buildWishFormData(wish) {
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
    wish.price ?? ''
  )

  formData.append(
    'is_public',
    String(wish.is_public)
  )

  formData.append(
    'visibility_group_ids',
    JSON.stringify(
      wish.visibility_group_ids || []
    )
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