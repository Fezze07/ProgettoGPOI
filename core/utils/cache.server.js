const caches = new Map()

export const setCache = (key, value, ttlSeconds = 60) => {
  const expiresAt = Date.now() + ttlSeconds * 1000
  caches.set(key, { value, expiresAt })
}

export const getCache = (key) => {
  const entry = caches.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    caches.delete(key)
    return null
  }
  return entry.value
}

export const delCache = (key) => {
  return caches.delete(key)
}

export const delPrefix = (prefix) => {
  for (const key of caches.keys()) {
    if (key.startsWith(prefix)) caches.delete(key)
  }
}

export const clearCache = () => {
  caches.clear()
}

export default {
  setCache,
  getCache,
  delCache,
  delPrefix,
  clearCache,
}
