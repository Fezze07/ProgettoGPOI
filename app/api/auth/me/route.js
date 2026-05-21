import { NextResponse } from 'next/server'
import { getAuthenticatedUser, getAccessTokenFromRequest } from '@/core/utils/authMiddleware.server'
import { profileUpdateSchema } from '@/features/auth/validators'
import { supabaseServer } from '@/core/supabase/supabaseServer.server'
import { buildJsonResponse } from '@/core/utils/response.server'
import { handleApiError } from '@/core/utils/errors.server'
import { hashPassword } from '@/features/auth/utils/authTokens.server'
import { setCache } from '@/core/utils/cache.server'


export async function GET(request) {
  try {
    // If there's no access token at all, return a 200 with null user so
    // client-side code doesn't try to refresh unnecessarily.
    const token = getAccessTokenFromRequest(request)
    if (!token) {
      return buildJsonResponse({ user: null }, 200)
    }

    const user = await getAuthenticatedUser(request)
    return buildJsonResponse({ user }, 200)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

export async function PATCH(request) {
  try {
    const user = await getAuthenticatedUser(request)
    const body = await request.json()
    const data = profileUpdateSchema.parse(body)

    const updates = {}
    if (data.fullName) {
      updates.full_name = data.fullName
    }
    if (data.password) {
      updates.password_hash = await hashPassword(data.password)
    }
    if (Object.keys(updates).length === 0) {
      return buildJsonResponse({ message: 'Nessuna modifica effettuata.' }, 200)
    }

    const { data: updatedUser, error } = await supabaseServer
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select('id, email, full_name, role')
      .single()

    if (error || !updatedUser) {
      throw new Error('Impossibile aggiornare il profilo')
    }

    try {
      setCache(`user:${updatedUser.id}`, updatedUser, 300)
    } catch (e) {
      // ignore cache errors
    }

    return buildJsonResponse({ user: updatedUser, message: 'Profilo aggiornato.' }, 200)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
