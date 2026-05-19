import { NextResponse } from 'next/server'
import { loginSchema } from '../../../../utils/validators'
import { validateCredentials, createSession } from '../../../../services/authService'
import { rateLimitAuth } from '../../../../utils/rateLimiter'
import { buildJsonResponse, setAuthCookies } from '../../../../utils/response'
import { handleApiError } from '../../../../utils/errors'

export async function POST(request) {
  try {
    await rateLimitAuth(request)
    const body = await request.json()
    const data = loginSchema.parse(body)
    const user = await validateCredentials({ email: data.email, password: data.password })
    const tokens = await createSession(user)
    let response = buildJsonResponse({ user, message: 'Accesso eseguito.' }, 200)
    response = setAuthCookies(response, tokens)
    return response
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
