import { NextResponse } from 'next/server'
import { getCookieMaxAge } from './security.server'



const secureFlag = process.env.NODE_ENV === 'production'

const accessTokenMaxAge = getCookieMaxAge(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN, 60 * 15)
const refreshTokenMaxAge = getCookieMaxAge(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN, 60 * 60 * 24 * 7)

export const buildJsonResponse = (body, status = 200) => {
  return NextResponse.json(body, { status })
}

export const setAuthCookies = (response, { accessToken, refreshToken }) => {
  response.cookies.set('gp_access_token', accessToken, {
    httpOnly: true,
    secure: secureFlag,
    sameSite: 'strict',
    path: '/',
    maxAge: accessTokenMaxAge,
  })
  response.cookies.set('gp_refresh_token', refreshToken, {
    httpOnly: true,
    secure: secureFlag,
    sameSite: 'strict',
    path: '/',
    maxAge: refreshTokenMaxAge,
  })
  return response
}

export const clearAuthCookies = (response) => {
  response.cookies.set('gp_access_token', '', {
    httpOnly: true,
    secure: secureFlag,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
  response.cookies.set('gp_refresh_token', '', {
    httpOnly: true,
    secure: secureFlag,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
  return response
}
