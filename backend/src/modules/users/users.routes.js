const { Router } = require('express')
const usersController = require('./users.controller')
const { authenticate, authorize } = require('../../middleware/auth')
const validate = require('../../middleware/validate')
const { updateProfileSchema, updateRoleSchema } = require('./users.validator')

const router = Router()

// GET /api/users/profile — usuario autenticado ve su perfil
router.get('/profile', authenticate, usersController.getProfile)

// PUT /api/users/profile — usuario autenticado actualiza su perfil
router.put('/profile', authenticate, validate(updateProfileSchema), usersController.updateProfile)

// GET /api/users — solo admin ve todos los usuarios
router.get('/', authenticate, authorize('ADMIN'), usersController.getAllUsers)

// PUT /api/users/:id/role — solo admin cambia rol
router.put('/:id/role', authenticate, authorize('ADMIN'), validate(updateRoleSchema), usersController.updateRole)

// DELETE /api/users/:id — solo admin desactiva usuario
router.delete('/:id', authenticate, authorize('ADMIN'), usersController.deactivate)

module.exports = router
