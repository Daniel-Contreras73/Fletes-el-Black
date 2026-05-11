const errorHandler = (err, req, res, next) => {
  console.error(err)

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message
    })
  }

  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  })
}

module.exports = errorHandler