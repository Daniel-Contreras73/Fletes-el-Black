const { Router } = require('express')
const ctrl = require('./destinations.controller')
const { authenticate } = require('../../middleware/auth')

const router = Router()

router.get('/', authenticate, ctrl.getAll)
router.post('/', authenticate, ctrl.create)
router.patch('/:id', authenticate, ctrl.update)
router.patch('/:id/default', authenticate, ctrl.setDefault)
router.delete('/:id', authenticate, ctrl.remove)

module.exports = router
