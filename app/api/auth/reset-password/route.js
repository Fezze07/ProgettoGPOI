import { NextResponse } from 'next/server'
import { resetPasswordSchema } from '../../../../utils/validators'
import { resetPassword } from '../../../../services/authService'
import { buildJsonResponse } from '../../../../utils/response'
import { handleApiError } from '../../../../utils/errors'

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
