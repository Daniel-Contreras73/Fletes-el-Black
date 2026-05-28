const { Router } = require('express')
const loyaltyController = require('./loyalty.controller')
const { authenticate } = require('../../middleware/auth')

const router = Router()

// GET /api/loyalty — resumen de puntos e historial del usuario
router.get('/', authenticate, loyaltyController.getSummary)

module.exports = router
