import { NextResponse } from 'next/server'
import { clearAuthCookies } from '@/core/utils/response.server'
import { getRefreshTokenFromRequest } from '@/features/auth/utils/cookies.server'
import { revokeRefreshToken } from '@/features/auth/auth.server'
import { handleApiError } from '@/core/utils/errors.server'


export async function POST(request) {
  try {
    const refreshToken = getRefreshTokenFromRequest(request)
    if (refreshToken) {
      await revokeRefreshToken(refreshToken)
    }
    const response = clearAuthCookies(NextResponse.json({ success: true, message: 'Logout completato.' }, { status: 200 }))
    return response
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
