import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/core/utils/authMiddleware.server'
import { getUserPortfolioData } from '@/features/portfolio/portfolio.server'
import { buildJsonResponse } from '@/core/utils/response.server'
import { handleApiError } from '@/core/utils/errors.server'

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request)
    const data = await getUserPortfolioData(user.id)
    return buildJsonResponse(data, 200)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
