export function useApi() {
  const baseUrl = import.meta.env.VITE_SERVICE_URL || ''
  const daoBaseUrl = import.meta.env.VITE_DAO_HOST_URL || ''

  const fetchApi = async (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`
    return fetch(url, options)
  }

  const fetchImage = async (imageId, imageType) => {
    const url = `${daoBaseUrl}/api/v1/images/${imageId}/${imageType}`
    return fetch(url)
  }

  return {
    fetchApi,
    fetchImage,
  }
}
