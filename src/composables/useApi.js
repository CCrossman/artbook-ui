import { useRouter } from 'vue-router'

export function useApi() {
  const baseUrl = import.meta.env.VITE_SERVICE_URL || ''
  const router = useRouter()

  const includeBearerToken = (options) => {
    const token = localStorage.getItem('authToken')
    const headers = { ...(options.headers || {}) }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return { ...options, headers }
  }

  const fetchAndClearToken = async (url, options) => {
    const response = await fetch(url, options)
    if (response.status === 401) {
      localStorage.removeItem('authToken')
      router.push('/')
    }
    return response
  }

  const fetchApi = async (endpoint, options = {}) => {
    const opts = includeBearerToken(options)
    const url = `${baseUrl}${endpoint}`
    // console.log("fetchApi with: ", url, options);
    return fetchAndClearToken(url, opts)
  }

  const fetchImages = async (params) => {
    const opts = includeBearerToken({})
    const url = `${baseUrl}/api/v1/images?${params.toString()}`
    // console.log("fetchImages with: ", url);
    return fetchAndClearToken(url, opts)
  }

  const fetchImage = async (imageId, imageType) => {
    const opts = includeBearerToken({})
    const url = `${baseUrl}/api/v1/images/${imageId}/${imageType}`
    // console.log("fetchImage with: ", url, options);
    return fetchAndClearToken(url, opts)
  }

  return {
    fetchApi,
    fetchImage,
    fetchImages,
  }
}
