import { NextResponse } from 'next/server'
import { forgotPasswordSchema } from '@/features/auth/validators'
import { createPasswordResetToken } from '@/features/auth/auth.server'
import { buildJsonResponse } from '@/core/utils/response.server'
import { handleApiError } from '@/core/utils/errors.server'


const buildResetUrl = (token) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5003'
  return `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`
}

const sendResetEmail = async (email, url) => {
  console.log(`[AUTH] Inviare email di reset password a ${email}: ${url}`)
}

export async function POST(request) {
  try {
    const body = await request.json()
    const data = forgotPasswordSchema.parse(body)
    try {
      const { user, token } = await createPasswordResetToken(data.email)
      const resetUrl = buildResetUrl(token)
      await sendResetEmail(user.email, resetUrl)
    } catch (innerError) {
      // Non rivelare se l'account esiste o meno.
    }
    return buildJsonResponse({ message: 'Email per il recupero password inviata se l\'account esiste.' }, 200)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
