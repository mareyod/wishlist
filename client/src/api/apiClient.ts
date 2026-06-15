import type { ErrorResponse } from "../types/auth.types"
const BASE_URL = import.meta.env.VITE_API_URL

let accessToken: string | null = null

export const setAccessToken = (token: string | null): void  => {
  accessToken = token
}

export const getAccessToken = (): string | null => {
  return accessToken
}

let onUnauthorized: (() => void) | null = null
 
export const setOnUnauthorized = (cb: (() => void) | null): void => {
  onUnauthorized = cb
}

export async function handleResponse<T>(res: Response, errorMessage: string): Promise<T> {
  const text = await res.text();

  let data: T;

  try {
    data = (text ? JSON.parse(text) : {}) as T;
  } catch (e) {
    throw new Error(errorMessage);
  }

  if (!res.ok) {
    const error = data as Partial<ErrorResponse>;
    throw new Error(error.message || errorMessage);
  }

  return data;
};

async function refreshToken(): Promise<boolean> {
  try {
      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "GET",
        credentials: "include",
      })
 
      if (!res.ok) return false
 
      const data = await res.json()
      setAccessToken(data.accessToken)
      return true
  } catch {
      return false
  }
}
 
export async function fetchWithRefresh(url: string, options: RequestInit): Promise<Response> {
  let res = await fetch(url, options)
 
  if (res.status === 401) {
    const ok = await refreshToken()
 
    if (ok) {
      const newHeaders = new Headers(options.headers)
      newHeaders.set("Authorization", `Bearer ${getAccessToken()}`)
      res = await fetch(url, { ...options, headers: newHeaders })
    } else {
      setAccessToken(null)
      onUnauthorized?.()
    }
  }
 
  return res
}