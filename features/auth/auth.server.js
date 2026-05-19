import { supabaseServer } from '@/core/supabase/supabaseServer.server'
import { hashPassword, verifyPassword, createRefreshToken, hashToken, createAccessToken } from '@/features/auth/utils/authTokens.server'
import { ApiError } from '@/core/utils/errors.server'
import { getCookieMaxAge } from '@/core/utils/security.server'


const refreshTokenTtlSeconds = getCookieMaxAge(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN, 60 * 60 * 24 * 7)
const passwordResetTtlSeconds = getCookieMaxAge(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN, 60 * 60)

const userSelect = 'id, email, full_name, role, is_active'

export const findUserByEmail = async (email) => {
  const { data, error } = await supabaseServer
    .from('users')
    .select(userSelect)
    .eq('email', email)
    .single()
  if (error) {
    return null
  }
  return data
}

export const findUserById = async (id) => {
  const { data, error } = await supabaseServer
    .from('users')
    .select(userSelect)
    .eq('id', id)
    .single()
  if (error) {
    return null
  }
  return data
}

export const createUser = async ({ fullName, email, password }) => {
  const existing = await findUserByEmail(email)
  if (existing) {
    throw new ApiError(409, 'Esiste già un account con questa email.')
  }
  const passwordHash = await hashPassword(password)
  const { data, error } = await supabaseServer.from('users').insert({
    email,
    full_name: fullName,
    password_hash: passwordHash,
    role: 'user',
    is_active: true,
  }).select(userSelect).single()

  if (error || !data) {
    throw new ApiError(500, 'Impossibile creare l\'utente.')
  }
  return data
}

export const validateCredentials = async ({ email, password }) => {
  const user = await findUserByEmail(email)
  if (!user || !user.is_active) {
    throw new ApiError(401, 'Email o password non corretti.')
  }
  const { data: userRecord, error } = await supabaseServer
    .from('users')
    .select('password_hash')
    .eq('email', email)
    .single()
  if (error || !userRecord) {
    throw new ApiError(401, 'Email o password non corretti.')
  }
  const isValid = await verifyPassword(password, userRecord.password_hash)
  if (!isValid) {
    throw new ApiError(401, 'Email o password non corretti.')
  }
  return user
}

export const createSession = async (user) => {
  const accessToken = createAccessToken({ sub: user.id, email: user.email, role: user.role })
  const refreshToken = createRefreshToken()
  const refreshTokenHash = hashToken(refreshToken)
  const expiresAt = new Date(Date.now() + refreshTokenTtlSeconds * 1000).toISOString()

  const { error } = await supabaseServer.from('auth_refresh_tokens').insert({
    user_id: user.id,
    token_hash: refreshTokenHash,
    expires_at: expiresAt,
  })

  if (error) {
    throw new ApiError(500, 'Impossibile creare la sessione di autenticazione.')
  }

  return { accessToken, refreshToken }
}

export const revokeRefreshToken = async (refreshToken) => {
  const tokenHash = hashToken(refreshToken)
  const { error } = await supabaseServer
    .from('auth_refresh_tokens')
    .update({ revoked: true })
    .eq('token_hash', tokenHash)

  if (error) {
    throw new ApiError(500, 'Impossibile revocare il token di refresh.')
  }
}

export const revokeAllUserSessions = async (userId) => {
  const { error } = await supabaseServer
    .from('auth_refresh_tokens')
    .update({ revoked: true })
    .eq('user_id', userId)

  if (error) {
    throw new ApiError(500, 'Impossibile revocare le sessioni utente.')
  }
}

export const rotateRefreshToken = async (refreshToken) => {
  const tokenHash = hashToken(refreshToken)
  const oldSession = await supabaseServer
    .from('auth_refresh_tokens')
    .select('id, user_id, revoked, expires_at')
    .eq('token_hash', tokenHash)
    .single()

  if (oldSession.error || !oldSession.data || oldSession.data.revoked) {
    throw new ApiError(401, 'Refresh token non valido o già revocato.')
  }

  const expiresAt = new Date(oldSession.data.expires_at)
  if (expiresAt.getTime() < Date.now()) {
    throw new ApiError(401, 'Refresh token scaduto.')
  }

  const { data: user, error: userError } = await supabaseServer
    .from('users')
    .select(userSelect)
    .eq('id', oldSession.data.user_id)
    .single()

  if (userError || !user) {
    throw new ApiError(401, 'Utente non trovato durante la rotazione del token.')
  }

  await supabaseServer
    .from('auth_refresh_tokens')
    .update({ revoked: true })
    .eq('id', oldSession.data.id)

  const newRefreshToken = createRefreshToken()
  const refreshTokenHash = hashToken(newRefreshToken)
  const newExpiresAt = new Date(Date.now() + refreshTokenTtlSeconds * 1000).toISOString()

  const { error: insertError } = await supabaseServer.from('auth_refresh_tokens').insert({
    user_id: user.id,
    token_hash: refreshTokenHash,
    expires_at: newExpiresAt,
  })

  if (insertError) {
    throw new ApiError(500, 'Impossibile ruotare il refresh token.')
  }

  const accessToken = createAccessToken({ sub: user.id, email: user.email, role: user.role })
  return { accessToken, refreshToken: newRefreshToken }
}

export const createPasswordResetToken = async (email) => {
  const user = await findUserByEmail(email)
  if (!user) {
    throw new ApiError(404, 'Utente non trovato.')
  }

  const rawToken = createRefreshToken()
  const tokenHash = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + passwordResetTtlSeconds * 1000).toISOString()

  const { error } = await supabaseServer.from('password_reset_tokens').insert({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt,
    used: false,
  })

  if (error) {
    throw new ApiError(500, 'Impossibile creare il token per il recupero password.')
  }

  return { user, token: rawToken }
}

export const resetPassword = async ({ token, password }) => {
  const tokenHash = hashToken(token)
  const result = await supabaseServer
    .from('password_reset_tokens')
    .select('id, user_id, expires_at, used')
    .eq('token_hash', tokenHash)
    .single()

  if (result.error || !result.data) {
    throw new ApiError(401, 'Token di reset non valido.')
  }

  if (result.data.used) {
    throw new ApiError(401, 'Token di reset già utilizzato.')
  }

  if (new Date(result.data.expires_at).getTime() < Date.now()) {
    throw new ApiError(401, 'Token di reset scaduto.')
  }

  const passwordHash = await hashPassword(password)
  const { error: updateError } = await supabaseServer
    .from('users')
    .update({ password_hash: passwordHash })
    .eq('id', result.data.user_id)

  if (updateError) {
    throw new ApiError(500, 'Impossibile aggiornare la password.')
  }

  await supabaseServer
    .from('password_reset_tokens')
    .update({ used: true })
    .eq('id', result.data.id)

  await revokeAllUserSessions(result.data.user_id)
}
