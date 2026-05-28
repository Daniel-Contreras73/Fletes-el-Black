const { Router } = require('express')
const paymentsController = require('./payments.controller')
const { authenticate } = require('../../middleware/auth')

const router = Router()

// GET /api/payments/mine — pagos del cliente (fletes aceptados)
router.get('/mine', authenticate, paymentsController.getMine)

// PATCH /api/payments/:freightId/preference — guardar preferencia de pago
router.patch('/:freightId/preference', authenticate, paymentsController.savePreference)

module.exports = router
