"use client";
import { useState, useEffect, useCallback } from 'react'
import fetchWithRefresh from '@/core/utils/fetchWithRefresh'

export default function useCurrentUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetchWithRefresh('/api/auth/me', { method: 'GET' })
      if (!res) return null
      if (res.ok) {
        const json = await res.json()
        setUser(json.user || null)
        return json.user || null
      }
      setUser(null)
      return null
    } catch (err) {
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    fetchUser()
    return () => { mounted = false }
  }, [fetchUser])

  const refreshUser = useCallback(async () => {
    return await fetchUser()
  }, [fetchUser])

  const logout = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      if (res.ok) setUser(null)
      return res
    } catch (err) {
      console.error('Logout error', err)
      throw err
    }
  }, [])

  return { user, loading, refreshUser, logout }
}
