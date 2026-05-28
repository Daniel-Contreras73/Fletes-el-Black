const { Router } = require('express')
const ctrl = require('./clients.controller')
const { authenticate, authorize } = require('../../middleware/auth')

const router = Router()

router.get('/', authenticate, authorize('ADMIN'), ctrl.getAll)
router.get('/:id', authenticate, authorize('ADMIN'), ctrl.getOne)
router.patch('/:id', authenticate, authorize('ADMIN'), ctrl.update)
router.delete('/:id', authenticate, authorize('ADMIN'), ctrl.deactivate)

module.exports = router
