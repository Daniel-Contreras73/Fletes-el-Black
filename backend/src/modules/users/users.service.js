const usersRepository = require('./users.repository')
const AppError = require('../../utils/AppError')

const getProfile = async (id) => {
  const user = await usersRepository.findById(id)
  if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND')
  return user
}

const getAllUsers = async () => {
  return usersRepository.findAll()
}

const updateProfile = async (id, data) => {
  const user = await usersRepository.findById(id)
  if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND')
  return usersRepository.update(id, data)
}

const updateRole = async (id, role) => {
  const user = await usersRepository.findById(parseInt(id))
  if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND')
  return usersRepository.update(parseInt(id), { role })
}

const deactivate = async (id) => {
  const user = await usersRepository.findById(parseInt(id))
  if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND')
  return usersRepository.update(parseInt(id), { isActive: false })
}

module.exports = { getProfile, getAllUsers, updateProfile, updateRole, deactivate }
