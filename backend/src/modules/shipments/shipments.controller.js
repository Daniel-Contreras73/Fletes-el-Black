const asyncHandler = require('../../utils/asyncHandler')
const shipmentsService = require('./shipments.service')

const create = asyncHandler(async (req, res) => {
  const shipment = await shipmentsService.createShipment(req.user.id, req.body)
  res.status(201).json({ status: 'ok', shipment })
})

const getOne = asyncHandler(async (req, res) => {
  const shipment = await shipmentsService.getShipment(req.params.id, req.user)
  res.status(200).json({ status: 'ok', shipment })
})

const getByFolio = asyncHandler(async (req, res) => {
  const shipment = await shipmentsService.getShipmentByFolio(req.params.folio)
  res.status(200).json({ status: 'ok', shipment })
})

const getMine = asyncHandler(async (req, res) => {
  const shipments = await shipmentsService.getMyShipments(req.user.id, req.user.role)
  res.status(200).json({ status: 'ok', shipments })
})

const getAll = asyncHandler(async (req, res) => {
  const filters = {}
  if (req.query.status) filters.status = req.query.status
  if (req.query.city) filters.originCity = req.query.city
  const shipments = await shipmentsService.getAllShipments(filters)
  res.status(200).json({ status: 'ok', shipments })
})

const updateStatus = asyncHandler(async (req, res) => {
  const shipment = await shipmentsService.updateStatus(req.params.id, req.body, req.user)
  res.status(200).json({ status: 'ok', shipment })
})

const cancel = asyncHandler(async (req, res) => {
  const shipment = await shipmentsService.cancelShipment(
    req.params.id, req.body.reason, req.user
  )
  res.status(200).json({ status: 'ok', shipment })
})

const assignCarrier = asyncHandler(async (req, res) => {
  const shipment = await shipmentsService.assignCarrier(
    req.params.id, req.body.bidId, req.user
  )
  res.status(200).json({ status: 'ok', shipment })
})

module.exports = { create, getOne, getByFolio, getMine, getAll, updateStatus, cancel, assignCarrier }