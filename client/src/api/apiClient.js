let accessToken = null

export const setAccessToken = (token) => {
    accessToken = token
}

export const getAccessToken = () => {
    return accessToken
}

export const handleResponse = async (res, errorMessage) => {
  const text = await res.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error(errorMessage);
  }

  if (!res.ok) {
    throw new Error(data?.message || errorMessage);
  }

  return data;
};