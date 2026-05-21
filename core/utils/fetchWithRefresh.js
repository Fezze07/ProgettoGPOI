// Client-side fetch helper that retries once after calling the refresh endpoint on 401
// Improvements: share a single refresh request across concurrent callers and
// avoid spamming the refresh endpoint after recent failures.

let refreshPromise = null
let lastRefreshFailedAt = 0
const REFRESH_COOLDOWN_MS = 5_000

export async function fetchWithRefresh(url, init = {}, attempt = 0) {
  const finalInit = { ...init }
  if (!finalInit.credentials) finalInit.credentials = 'include'

  let res
  try {
    res = await fetch(url, finalInit)
  } catch (err) {
    throw err
  }

  if (res.status !== 401) return res

  // If already retried, return the 401 response
  if (attempt >= 1) return res

  // If a refresh recently failed, avoid retrying immediately
  const now = Date.now()
  if (lastRefreshFailedAt && now - lastRefreshFailedAt < REFRESH_COOLDOWN_MS) {
    return res
  }

  // Share refresh request across callers to avoid multiple parallel POSTs
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const r = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
        if (!r.ok) {
          lastRefreshFailedAt = Date.now()
        }
        return r
      } catch (err) {
        lastRefreshFailedAt = Date.now()
        throw err
      }
    })()
  }

  let refreshRes
  try {
    refreshRes = await refreshPromise
  } catch (err) {
    refreshPromise = null
    return res
  }
  refreshPromise = null

  if (!refreshRes || !refreshRes.ok) {
    return res
  }

  // Retry original request once
  return fetchWithRefresh(url, init, attempt + 1)
}

export default fetchWithRefresh
