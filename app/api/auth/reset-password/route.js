import { NextResponse } from 'next/server'
import { resetPasswordSchema } from '@/features/auth/validators'
import { resetPassword } from '@/features/auth/auth.server'
import { buildJsonResponse } from '@/core/utils/response.server'
import { handleApiError } from '@/core/utils/errors.server'


export async function POST(request) {
  try {
    const body = await request.json()
    const data = resetPasswordSchema.parse(body)
    await resetPassword({ token: data.token, password: data.password })
    return buildJsonResponse({ message: 'Password aggiornata con successo.' }, 200)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
