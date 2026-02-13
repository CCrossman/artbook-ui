export function parseJwt(token) {
  if (!token) return null

  const parts = token.split('.')
  if (parts.length < 2) return null

  const payload = parts[1]

  // base64url -> base64
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  try {
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    console.log("Parsed JWT payload:", json)
    return JSON.parse(json)
  } catch (err) {
    console.error('Failed to parse JWT:', err)
    return null
  }
}

export function useJwt() {
  const TOKEN_KEY_IN_STORAGE = 'authToken'

  function getToken() {
    try {
      const rawToken = localStorage.getItem(TOKEN_KEY_IN_STORAGE)
      console.log("Retrieved token from localStorage:", rawToken)
      return rawToken
    } catch (err) {
      console.error('Failed to retrieve token from localStorage:', err)
      return null
    }
  }

  function getPayload() {
    const t = getToken()
    return parseJwt(t)
  }

  function getPermissions(payload) {
    if (!payload) return []

    if (payload.permissions) {
        const arr = Array.isArray(payload.permissions) ? payload.permissions : [payload.permissions]
        return arr.map(o => o.authority)
    }
    return []
  }

  function getLimits(payload) {
    if (!payload) return []

    if (payload.limits) {
        return Array.isArray(payload.limits) ? payload.limits : [payload.limits]
    }
    return []
  }

  function hasLimit(limit) {
    const payload = getPayload()
    if (!payload) return false

    const limits = getLimits(payload)
    return limits.some((a) => String(a).toLowerCase() === String(limit).toLowerCase())
  }

  function hasPermission(permission) {
    const payload = getPayload()
    if (!payload) return false

    const permissions = getPermissions(payload)
    return permissions.some((a) => String(a).toLowerCase() === String(permission).toLowerCase())
  }

  function hasAnyPermissions(list) {
    if (!Array.isArray(list) || list.length === 0) return false

    const payload = getPayload()
    if (!payload) return false

    const permissions = getPermissions(payload)
    const lowered = permissions.map((a) => String(a).toLowerCase())
    return list.some((want) => lowered.includes(String(want).toLowerCase()))
  }

  function setToken(token) {
    console.log("setting token:", token)
    localStorage.setItem(TOKEN_KEY_IN_STORAGE, token)
  }

  return {
    hasAnyPermissions,
    hasLimit,
    hasPermission,
    setToken,
  }
}

export default useJwt
