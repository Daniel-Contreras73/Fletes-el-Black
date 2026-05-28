const asyncHandler = require('../../utils/asyncHandler')
const svc = require('./destinations.service')

const getAll = asyncHandler(async (req, res) => {
  res.json(await svc.getAll(req.user.id))
})

const create = asyncHandler(async (req, res) => {
  const dest = await svc.create(req.user.id, req.body)
  res.status(201).json(dest)
})

const update = asyncHandler(async (req, res) => {
  res.json(await svc.update(Number(req.params.id), req.user.id, req.body))
})

const setDefault = asyncHandler(async (req, res) => {
  res.json(await svc.setDefault(Number(req.params.id), req.user.id))
})

const remove = asyncHandler(async (req, res) => {
  res.json(await svc.remove(Number(req.params.id), req.user.id))
})

module.exports = { getAll, create, update, setDefault, remove }
