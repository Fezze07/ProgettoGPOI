import { NextResponse } from 'next/server'
import { clearAuthCookies } from '../../../../utils/response'
import { getRefreshTokenFromRequest } from '../../../../utils/cookies'
import { revokeRefreshToken } from '../../../../services/authService'
import { handleApiError } from '../../../../utils/errors'

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
