const usersRepository = require('./users.repository')
const AppError = require('../../utils/AppError')
const prisma = require('../../config/prisma')
const bcrypt = require('bcryptjs')

const getProfile = async (id) => {
  const user = await usersRepository.findById(id)
  if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND')
  return user
}

const getAllUsers = async (role) => {
  return usersRepository.findAll(role)
}

const updateProfile = async (id, data) => {
  const user = await usersRepository.findById(id)
  if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND')
  return usersRepository.update(id, data)
}

const updateRole = async (id, role) => {
  const user = await usersRepository.findById(parseInt(id))
  if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND')

  const roleRecord = await prisma.role.findFirst({ where: { userType: role } })
  if (!roleRecord) throw new AppError('Rol no válido', 400, 'INVALID_ROLE')

  return usersRepository.update(parseInt(id), { roleId: roleRecord.id })
}

const deactivate = async (id) => {
  const user = await usersRepository.findById(parseInt(id))
  if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND')
  return usersRepository.update(parseInt(id), { isActive: false })
}

//AGREGADO DE ADMIN
const getUserById = async (id) => {
  const user = await usersRepository.findById(parseInt(id))
  if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND')
  return user
}

const updateUser = async (id, data) => {
  const user = await usersRepository.findById(parseInt(id))
  if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND')
  return usersRepository.update(parseInt(id), data)
}

const createUser = async ({ firstName, lastName, email, password, phone, role = 'CLIENT' }) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new AppError('El email ya está registrado', 400, 'EMAIL_TAKEN')

  const roleRecord = await prisma.role.findFirst({ where: { userType: role } })
  if (!roleRecord) throw new AppError('Rol no válido', 400, 'INVALID_ROLE')

  const passwordHash = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: { firstName, lastName, email, phone, passwordHash, roleId: roleRecord.id },
    select: {
      id: true, firstName: true, lastName: true, email: true,
      phone: true, role: { select: { userType: true } }, isActive: true, createdAt: true
    }
  })
}

module.exports = { getProfile, getAllUsers, updateProfile, updateRole, deactivate, getUserById, createUser, updateUser }
