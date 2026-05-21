import { cookies as nextCookies } from 'next/headers'

export const parseCookie = (cookieHeader) => {
  if (!cookieHeader) return {}
  return cookieHeader.split(';').reduce((acc, fragment) => {
    const [name, ...rest] = fragment.trim().split('=')
    if (!name) return acc
    acc[name] = rest.join('=').trim()
    return acc
  }, {})
}

export const getRefreshTokenFromRequest = async (request) => {
  try {
    const store = await nextCookies()
    const entry = store.get('gp_refresh_token')
    if (entry && entry.value) return entry.value
  } catch (e) {
    // ignore and fallback to header parsing
  }

  if (!request || !request.headers) return null
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null
  const cookies = parseCookie(cookieHeader)
  return cookies['gp_refresh_token'] || null
}
