const asyncHandler = require('../../utils/asyncHandler')
const authService = require('./auth.service')

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body)

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(201).json({
    status: 'ok',
    accessToken: result.accessToken,
    user: result.user
  })
})

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body)

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(200).json({
    status: 'ok',
    accessToken: result.accessToken,
    user: result.user
  })
})

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'No hay refresh token' })
  }

  const result = await authService.refresh(token)

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(200).json({
    status: 'ok',
    accessToken: result.accessToken
  })
})

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken
  if (token) await authService.logout(token)

  res.clearCookie('refreshToken')
  res.status(200).json({ status: 'ok', message: 'Sesión cerrada' })
})

module.exports = { register, login, refresh, logout }
