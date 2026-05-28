const asyncHandler = require('../../utils/asyncHandler')
const svc = require('./reports.service')

const getSummary = asyncHandler(async (req, res) => {
  res.json(await svc.getSummary())
})

const getRevenue = asyncHandler(async (req, res) => {
  const { from, to } = req.query
  res.json(await svc.getRevenue({ from, to }))
})

const getShipmentStats = asyncHandler(async (req, res) => {
  res.json(await svc.getShipmentStats())
})

const getTopClients = asyncHandler(async (req, res) => {
  const { limit } = req.query
  res.json(await svc.getTopClients({ limit: Number(limit) || 10 }))
})

module.exports = { getSummary, getRevenue, getShipmentStats, getTopClients }
