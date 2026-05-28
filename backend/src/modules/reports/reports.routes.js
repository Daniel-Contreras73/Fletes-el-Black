const { Router } = require('express')
const ctrl = require('./reports.controller')
const { authenticate, authorize } = require('../../middleware/auth')

const router = Router()

router.get('/summary', authenticate, authorize('ADMIN'), ctrl.getSummary)
router.get('/revenue', authenticate, authorize('ADMIN'), ctrl.getRevenue)
router.get('/shipments', authenticate, authorize('ADMIN'), ctrl.getShipmentStats)
router.get('/clients', authenticate, authorize('ADMIN'), ctrl.getTopClients)

module.exports = router
