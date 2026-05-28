const { Router } = require('express')
const ctrl = require('./appointments.controller')
const { authenticate, authorize } = require('../../middleware/auth')

const router = Router()

router.post('/', authenticate, authorize('CLIENT', 'ADMIN'), ctrl.create)
router.get('/', authenticate, ctrl.getAll)
router.get('/:id', authenticate, ctrl.getOne)
router.patch('/:id/status', authenticate, authorize('ADMIN'), ctrl.updateStatus)
router.delete('/:id', authenticate, ctrl.cancel)

module.exports = router
