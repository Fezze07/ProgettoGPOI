export const parseCookie = (cookieHeader) => {
  if (!cookieHeader) return {}
  return cookieHeader.split(';').reduce((acc, fragment) => {
    const [name, ...rest] = fragment.trim().split('=')
    if (!name) return acc
    acc[name] = rest.join('=').trim()
    return acc
  }, {})
}

export const getRefreshTokenFromRequest = (request) => {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null
  const cookies = parseCookie(cookieHeader)
  return cookies['gp_refresh_token'] || null
}
