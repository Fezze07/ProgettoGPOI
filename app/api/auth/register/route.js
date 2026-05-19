import { NextResponse } from 'next/server'
import { registerSchema } from '../../../../utils/validators'
import { createUser, createSession } from '../../../../services/authService'
import { buildJsonResponse, setAuthCookies } from '../../../../utils/response'
import { handleApiError } from '../../../../utils/errors'

export async function POST(request) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)
    const user = await createUser({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })
    const tokens = await createSession(user)
    let response = buildJsonResponse({ user, message: 'Registrazione completata.' }, 201)
    response = setAuthCookies(response, tokens)
    return response
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
