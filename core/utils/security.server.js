export const sanitizeString = (value) => {
  if (typeof value !== 'string') return value
  return value.replace(/<[^>]*>/g, '').trim()
}

export const normalizeEmail = (value) => {
  if (typeof value !== 'string') return value
  return value.trim().toLowerCase()
}

export const getCookieMaxAge = (envValue, fallbackSeconds) => {
  if (!envValue) return fallbackSeconds
  const value = envValue.toLowerCase().trim()
  if (value.endsWith('m')) return parseInt(value.slice(0, -1), 10) * 60
  if (value.endsWith('h')) return parseInt(value.slice(0, -1), 10) * 3600
  if (value.endsWith('d')) return parseInt(value.slice(0, -1), 10) * 86400
  const numeric = parseInt(value, 10)
  return Number.isNaN(numeric) ? fallbackSeconds : numeric
}
