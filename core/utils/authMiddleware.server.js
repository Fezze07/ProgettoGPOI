import { NextResponse } from 'next/server'
import { verifyAccessToken } from '@/features/auth/utils/authTokens.server'
import { ApiError } from '@/core/utils/errors.server'
import { supabaseServer } from '@/core/supabase/supabaseServer.server'
import { getCache, setCache } from '@/core/utils/cache.server'

const AUTH_HEADER = 'authorization'

const parseBearerToken = (request) => {
  const header = request.headers.get(AUTH_HEADER)
  if (!header) return null
  const [scheme, token] = header.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null
  return token
}

export const getAccessTokenFromRequest = (request) => {
  const bearerToken = parseBearerToken(request)
  if (bearerToken) return bearerToken
  const cookie = request.headers.get('cookie')
  if (!cookie) return null
  const match = cookie.match(/gp_access_token=([^;]+)/)
  return match ? match[1] : null
}

export const getAuthenticatedUser = async (request) => {
  const token = getAccessTokenFromRequest(request)
  if (!token) {
    throw new ApiError(401, 'Token di accesso mancante o non valido')
  }

  let payload
  try {
    payload = verifyAccessToken(token)
  } catch (error) {
    throw new ApiError(401, 'Token di accesso scaduto o non valido')
  }

  const cacheKey = `user:${payload.sub}`
  const cached = getCache(cacheKey)
  if (cached) return cached

  const { data: user, error } = await supabaseServer
    .from('users')
    .select('id, email, full_name, role')
    .eq('id', payload.sub)
    .single()

  if (error || !user) {
    throw new ApiError(401, 'Utente non trovato o non autorizzato')
  }

  try {
    setCache(cacheKey, user, 300) // cache utente per 5 minuti
  } catch (e) {
    // ignore cache errors
  }

  return user
}

export const requireAdmin = async (request) => {
  const user = await getAuthenticatedUser(request)
  if (user.role !== 'admin') {
    throw new ApiError(403, 'Accesso negato: permessi insufficienti')
  }
  return user
}
