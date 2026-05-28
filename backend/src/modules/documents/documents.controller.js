const asyncHandler = require('../../utils/asyncHandler')
const svc = require('./documents.service')

const getMyDocuments = asyncHandler(async (req, res) => {
  res.json(await svc.getMyDocuments(req.user.id))
})

const getAll = asyncHandler(async (req, res) => {
  res.json(await svc.getAll())
})

const upload = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' })
  const { freightId, documentType } = req.body
  if (!freightId || !documentType) return res.status(400).json({ error: 'freightId y documentType son requeridos' })
  const doc = await svc.upload({
    freightId: Number(freightId),
    documentType,
    filename: req.file.filename,
    uploadedBy: req.user.id,
  })
  res.status(201).json(doc)
})

const remove = asyncHandler(async (req, res) => {
  res.json(await svc.remove(Number(req.params.id)))
})

module.exports = { getMyDocuments, getAll, upload, remove }
