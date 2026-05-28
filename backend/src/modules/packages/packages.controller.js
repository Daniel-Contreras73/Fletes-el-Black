const asyncHandler = require('../../utils/asyncHandler')
const svc = require('./packages.service')

const getAll = asyncHandler(async (req, res) => {
  res.json(await svc.getAll(req.user.id, req.user.role))
})

const getOne = asyncHandler(async (req, res) => {
  res.json(await svc.getOne(Number(req.params.id), req.user.id, req.user.role))
})

const create = asyncHandler(async (req, res) => {
  const pkg = await svc.create(req.body, req.user.id, req.user.role)
  res.status(201).json(pkg)
})

const update = asyncHandler(async (req, res) => {
  res.json(await svc.update(Number(req.params.id), req.body, req.user.id, req.user.role))
})

const remove = asyncHandler(async (req, res) => {
  res.json(await svc.remove(Number(req.params.id), req.user.id, req.user.role))
})

module.exports = { getAll, getOne, create, update, remove }
