export function useApi() {
  const baseUrl = import.meta.env.VITE_SERVICE_URL || ''
  const daoBaseUrl = import.meta.env.VITE_DAO_HOST || ''

  const fetchApi = async (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`
    // console.log("fetchApi with: ", url, options);
    return fetch(url, options)
  }

  const fetchImages = async (params) => {
    const url = `${daoBaseUrl}/api/v1/image?${params.toString()}`
    // console.log("fetchImages with: ", url);
    return fetch(url)
  }


  const fetchImage = async (imageId, imageType) => {
    const url = `${daoBaseUrl}/api/v1/images/${imageId}/${imageType}`
    // console.log("fetchImage with: ", url, options);
    return fetch(url)
  }

  return {
    fetchApi,
    fetchImage,
    fetchImages,
  }
}
