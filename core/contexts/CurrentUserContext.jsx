"use client"
import React, { createContext, useState, useEffect, useCallback } from 'react'
import fetchWithRefresh from '@/core/utils/fetchWithRefresh'

export const CurrentUserContext = createContext(null)

let sharedUserPromise = null
let cachedUser = null
let cachedAt = 0
const CACHE_TTL_MS = 1000 * 60 * 5 // 5 minutes

const loadCurrentUser = () => {
  // Return cached value if fresh
  if (cachedUser && Date.now() - cachedAt < CACHE_TTL_MS) {
    return Promise.resolve(cachedUser)
  }

  if (!sharedUserPromise) {
    sharedUserPromise = (async () => {
      try {
        const res = await fetchWithRefresh('/api/auth/me', { method: 'GET' })
        if (!res || !res.ok) return null
        const json = await res.json()
        cachedUser = json.user || null
        cachedAt = Date.now()
        return cachedUser
      } catch (err) {
        return null
      } finally {
        sharedUserPromise = null
      }
    })()
  }
  return sharedUserPromise
}

export function CurrentUserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    loadCurrentUser().then((u) => {
      if (!mounted) return
      setUser(u)
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  const refreshUser = useCallback(async () => {
    // invalidate cache and reload
    cachedUser = null
    cachedAt = 0
    sharedUserPromise = null
    setLoading(true)
    const u = await loadCurrentUser()
    setUser(u)
    setLoading(false)
    return u
  }, [])

  const logout = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      if (res.ok) {
        // clear client cache on logout
        cachedUser = null
        cachedAt = 0
        sharedUserPromise = null
        setUser(null)
      }
      return res
    } catch (err) {
      console.error('Logout error', err)
      throw err
    }
  }, [])

  return (
    <CurrentUserContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export default CurrentUserProvider
