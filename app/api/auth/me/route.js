import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '../../../../middlewares/authMiddleware'
import { profileUpdateSchema } from '../../../../utils/validators'
import { supabaseServer } from '../../../../utils/supabaseServer'
import { buildJsonResponse } from '../../../../utils/response'
import { handleApiError } from '../../../../utils/errors'
import { hashPassword } from '../../../../utils/authTokens'

export async function GET(request) {
  try {
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

    return buildJsonResponse({ user: updatedUser, message: 'Profilo aggiornato.' }, 200)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
