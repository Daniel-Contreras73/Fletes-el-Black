const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No autorizado', 401, 'UNAUTHORIZED'))
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return next(new AppError('Token inválido o expirado', 401, 'INVALID_TOKEN'))
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Sin permisos para esta acción', 403, 'FORBIDDEN'))
    }
    next()
  }
}

module.exports = { authenticate, authorize }
