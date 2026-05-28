const asyncHandler = require('../../utils/asyncHandler')
const svc = require('./appointments.service')

const create = asyncHandler(async (req, res) => {
  const appt = await svc.create({ ...req.body, userId: req.user.id, role: req.user.role })
  res.status(201).json(appt)
})

const getAll = asyncHandler(async (req, res) => {
  const appts = await svc.getAll(req.user.id, req.user.role)
  res.json(appts)
})

const getOne = asyncHandler(async (req, res) => {
  const appt = await svc.getOne(Number(req.params.id), req.user.id, req.user.role)
  res.json(appt)
})

const updateStatus = asyncHandler(async (req, res) => {
  const appt = await svc.updateStatus(Number(req.params.id), req.body.status)
  res.json(appt)
})

const cancel = asyncHandler(async (req, res) => {
  const appt = await svc.cancel(Number(req.params.id), req.user.id, req.user.role)
  res.json(appt)
})

module.exports = { create, getAll, getOne, updateStatus, cancel }
