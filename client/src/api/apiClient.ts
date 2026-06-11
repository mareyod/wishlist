import type { ErrorResponse } from "../types/auth.types"
let accessToken: string | null = null

export const setAccessToken = (token: string | null): void  => {
  accessToken = token
}

export const getAccessToken = (): string | null => {
  return accessToken
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