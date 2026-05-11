const asyncHandler = require('../../utils/asyncHandler')
const usersService = require('./users.service')

const getProfile = asyncHandler(async (req, res) => {
  const user = await usersService.getProfile(req.user.id)
  res.status(200).json({ status: 'ok', user })
})

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await usersService.getAllUsers()
  res.status(200).json({ status: 'ok', users })
})

const updateProfile = asyncHandler(async (req, res) => {
  const user = await usersService.updateProfile(req.user.id, req.body)
  res.status(200).json({ status: 'ok', user })
})

const updateRole = asyncHandler(async (req, res) => {
  const user = await usersService.updateRole(req.params.id, req.body.role)
  res.status(200).json({ status: 'ok', user })
})

const deactivate = asyncHandler(async (req, res) => {
  await usersService.deactivate(req.params.id)
  res.status(200).json({ status: 'ok', message: 'Usuario desactivado' })
})

module.exports = { getProfile, getAllUsers, updateProfile, updateRole, deactivate }
