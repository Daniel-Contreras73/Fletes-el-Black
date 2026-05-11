const { ZodError } = require('zod')
const AppError = require('../utils/AppError')

const validate = (schema) => {
  return (req, _res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        return next(new AppError(message.join(', '), 400, 'VALIDATION_ERROR'))
      }
      next(err)
    }
  }
}

module.exports = validate
