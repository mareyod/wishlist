let accessToken = null

export const setAccessToken = (token) => {
    accessToken = token
}

export const getAccessToken = () => {
    return accessToken
}

export const handleResponse = async (res, errorMessage) => {
  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      data?.message || errorMessage
    )
  }

  return data
}
