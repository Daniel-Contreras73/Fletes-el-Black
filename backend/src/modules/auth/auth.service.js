const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../../config/prisma')
const AppError = require('../../utils/AppError')

// ─── GENERAR TOKENS ─────────────────────────────────────
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role?.userType || user.userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  )

  return { accessToken, refreshToken }
}

// ─── REGISTRO ───────────────────────────────────────────
const register = async ({ firstName, lastName, email, phone, password, roleId = 2 }) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new AppError('El email ya está registrado', 400, 'EMAIL_TAKEN')

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { firstName, lastName, email, phone, passwordHash: hashedPassword, roleId },
    include: { role: true }
  })

  const { accessToken, refreshToken } = generateTokens(user)

  await prisma.userAuthToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshToken,
      type: 'REFRESH',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email }
  }
}

// ─── LOGIN ──────────────────────────────────────────────
const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true }
  })
  if (!user) throw new AppError('Credenciales inválidas', 401, 'INVALID_CREDENTIALS')

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) throw new AppError('Credenciales inválidas', 401, 'INVALID_CREDENTIALS')

  const { accessToken, refreshToken } = generateTokens(user)

  await prisma.userAuthToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshToken,
      type: 'REFRESH',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: { userType: user.role?.userType }
    }
  }
}

// ─── REFRESH TOKEN ──────────────────────────────────────
const refresh = async (refreshToken) => {
  const stored = await prisma.userAuthToken.findUnique({
    where: { tokenHash: refreshToken },
    include: { user: true }
  })

  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError('Refresh token inválido', 401, 'INVALID_REFRESH_TOKEN')
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(stored.user)

  await prisma.userAuthToken.delete({ where: { tokenHash: refreshToken } })
  await prisma.userAuthToken.create({
    data: {
      userId: stored.user.id,
      tokenHash: newRefreshToken,
      type: 'REFRESH',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  return { accessToken, refreshToken: newRefreshToken }
}

// ─── LOGOUT ─────────────────────────────────────────────
const logout = async (refreshToken) => {
  await prisma.userAuthToken.deleteMany({ where: { tokenHash: refreshToken } })
}

module.exports = { register, login, refresh, logout }
