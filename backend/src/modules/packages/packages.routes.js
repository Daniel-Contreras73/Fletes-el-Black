const { Router } = require('express')
const ctrl = require('./packages.controller')
const { authenticate, authorize } = require('../../middleware/auth')

const router = Router()

router.get('/', authenticate, ctrl.getAll)
router.get('/:id', authenticate, ctrl.getOne)
router.post('/', authenticate, authorize('CLIENT', 'ADMIN'), ctrl.create)
router.patch('/:id', authenticate, authorize('CLIENT', 'ADMIN'), ctrl.update)
router.delete('/:id', authenticate, authorize('CLIENT', 'ADMIN'), ctrl.remove)

module.exports = router
