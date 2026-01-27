import { computed } from 'vue'

export function useApi() {
  const baseUrl = import.meta.env.VITE_SERVICE_URL || ''

  const fetchApi = async (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`
    return fetch(url, options)
  }

  return {
    baseUrl: computed(() => baseUrl),
    fetchApi,
  }
}
