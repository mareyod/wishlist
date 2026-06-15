import type { AuthResponse, LoginBody, RegistrationBody, AvatarUploadResponse, ChangeAvatarResponse } from "../types/auth.types";

import { setAccessToken, getAccessToken, handleResponse, fetchWithRefresh } from './apiClient'

const BASE_URL = import.meta.env.VITE_API_URL+"/api/auth";


export const login = async (userInfo: LoginBody): Promise<AuthResponse>  => {
  const res = await fetch(BASE_URL + '/login', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userInfo),
  });

  return handleResponse<AuthResponse>(res, 'Ошибка авторизации')
};

export const registration = async (userInfo: RegistrationBody): Promise<AuthResponse>  => {
  const res = await fetch(BASE_URL + "/registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userInfo),
  });

  return handleResponse<AuthResponse>(res, 'Ошибка регистрации')
};

export const logout = async (): Promise<void> => {
    await fetch(BASE_URL + "/logout", {
        method: "POST",
        credentials: "include",
    });
    setAccessToken(null)
};

export const refresh = async (): Promise<AuthResponse> => {
  const res = await fetch(BASE_URL + "/refresh", {
    method: "GET",
    credentials: "include",
  });

  return handleResponse<AuthResponse>(res, 'Ошибка обновления токена')
};

export const uploadAvatar = async (file: File): Promise<AvatarUploadResponse>  => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(BASE_URL + '/uploadAvatar', {
    method: 'POST',
    credentials: "include",
    body: formData
  })

  return handleResponse<AvatarUploadResponse>(res, 'Ошибка загрузки изображения')
}

export const changeAvatar = async (file: File): Promise<ChangeAvatarResponse> => {
  const token = getAccessToken()
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetchWithRefresh(BASE_URL+'/changeAvatar', {
    method: 'POST',
    headers: {
        Authorization: token ? `Bearer ${token}` : ''
    },
    credentials: 'include',
    body: formData
  });

  return handleResponse<ChangeAvatarResponse>(res, 'Ошибка загрузки изображения')

}

