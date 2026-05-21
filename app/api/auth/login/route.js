import { NextResponse } from 'next/server'
import { loginSchema } from '@/features/auth/validators'
import { validateCredentials, createSession } from '@/features/auth/auth.server'
import { rateLimitAuth } from '@/core/utils/rateLimiter.server'
import { buildJsonResponse, setAuthCookies } from '@/core/utils/response.server'
import { handleApiError } from '@/core/utils/errors.server'


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
