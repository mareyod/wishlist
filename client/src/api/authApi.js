import { setAccessToken, handleResponse } from './apiClient'

const BASE_URL = import.meta.env.VITE_API_URL+"/api/auth";


export const login = async (userInfo) => {
  const res = await fetch(BASE_URL + '/login', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userInfo),
  });

  return handleResponse(res, 'Ошибка авторизации')
};

export const registration = async (userInfo) => {
  const res = await fetch(BASE_URL + "/registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userInfo),
  });

  return handleResponse(res, 'Ошибка регистрации')
};

export const logout = async () => {
    await fetch(BASE_URL + "/logout", {
        method: "POST",
        credentials: "include",
    });
    setAccessToken(null)
};

export const refresh = async () => {
  const res = await fetch(BASE_URL + "/refresh", {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(res, 'Ошибка обновления токена')
};

export const uploadAvatar = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(BASE_URL + '/uploadAvatar', {
    method: 'POST',
    credentials: "include",
    body: formData
  })

  return handleResponse(res, 'Ошибка загрузки изображения')
}

