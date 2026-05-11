const { Router } = require('express')
const authController = require('./auth.controller')
const validate = require('../../middleware/validate')
const { registerSchema, loginSchema } = require('./auth.validator')

const router = Router()

// POST /api/auth/register
router.post('/register', validate(registerSchema), authController.register)

// POST /api/auth/login
router.post('/login', validate(loginSchema), authController.login)

// POST /api/auth/refresh
router.post('/refresh', authController.refresh)

// POST /api/auth/logout
router.post('/logout', authController.logout)

module.exports = router
