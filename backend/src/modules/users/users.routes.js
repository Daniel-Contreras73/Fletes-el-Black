const { Router } = require('express')
const usersController = require('./users.controller')
const { authenticate, authorize } = require('../../middleware/auth')
const validate = require('../../middleware/validate')
const { updateProfileSchema, updateRoleSchema, getUserByIdSchema, createUserSchema, updateUserSchema } = require('./users.validator')

const router = Router()

// POST /api/users — admin crea un nuevo usuario
router.post('/', authenticate, authorize('ADMIN'), validate(createUserSchema), usersController.createUser)

// GET /api/users/profile — usuario autenticado ve su perfil
router.get('/profile', authenticate, usersController.getProfile)

// PUT /api/users/profile — usuario autenticado actualiza su perfil
router.put('/profile', authenticate, validate(updateProfileSchema), usersController.updateProfile)

// GET /api/users — solo admin ve todos los usuarios
router.get('/', authenticate, authorize('ADMIN'), usersController.getAllUsers)

// PUT /api/users/:id/role — solo admin cambia rol
router.put('/:id/role', authenticate, authorize('ADMIN'), validate(updateRoleSchema), usersController.updateRole)

// PUT /api/users/:id — solo admin edita datos de un usuario
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateUserSchema), usersController.updateUser)

// DELETE /api/users/:id — solo admin desactiva usuario
router.delete('/:id', authenticate, authorize('ADMIN'), usersController.deactivate)

router.get('/:id', authenticate, authorize('ADMIN'), validate(getUserByIdSchema), usersController.getUserById)

module.exports = router
