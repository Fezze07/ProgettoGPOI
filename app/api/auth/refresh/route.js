import { NextResponse } from 'next/server'
import { getRefreshTokenFromRequest } from '../../../../utils/cookies'
import { rotateRefreshToken } from '../../../../services/authService'
import { setAuthCookies, buildJsonResponse } from '../../../../utils/response'
import { handleApiError } from '../../../../utils/errors'

export async function POST(request) {
  try {
    const refreshToken = getRefreshTokenFromRequest(request)
    if (!refreshToken) {
      throw new Error('Refresh token mancante')
    }
    const tokens = await rotateRefreshToken(refreshToken)
    let response = buildJsonResponse({ message: 'Sessione rinnovata.' }, 200)
    response = setAuthCookies(response, tokens)
    return response
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
