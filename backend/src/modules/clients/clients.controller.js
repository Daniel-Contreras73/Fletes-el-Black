const asyncHandler = require('../../utils/asyncHandler')
const svc = require('./clients.service')

const getAll = asyncHandler(async (req, res) => {
  const { search, page, limit } = req.query
  const result = await svc.getAll({ search, page: Number(page) || 1, limit: Number(limit) || 20 })
  res.json(result)
})

const getOne = asyncHandler(async (req, res) => {
  const client = await svc.getOne(Number(req.params.id))
  res.json(client)
})

const update = asyncHandler(async (req, res) => {
  const client = await svc.update(Number(req.params.id), req.body)
  res.json(client)
})

const deactivate = asyncHandler(async (req, res) => {
  const result = await svc.deactivate(Number(req.params.id))
  res.json(result)
})

module.exports = { getAll, getOne, update, deactivate }
