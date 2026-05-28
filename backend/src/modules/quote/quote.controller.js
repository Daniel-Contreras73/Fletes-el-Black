const asyncHandler = require('../../utils/asyncHandler')
const { analyzeImages, calculateQuote } = require('./quote.service')

const analyze = asyncHandler(async (req, res) => {
  const { images, zone } = req.body
  if (!images?.length) {
    return res.status(400).json({ error: 'Se requieren imágenes para analizar' })
  }
  const result = await analyzeImages(images, zone || 'Chetumal')
  res.json(result)
})

const calculate = asyncHandler(async (req, res) => {
  const { objetos, zone, tipo, proteccion, dificultades } = req.body
  if (!objetos?.length) {
    return res.status(400).json({ error: 'Se requieren objetos para cotizar' })
  }
  const result = await calculateQuote(objetos, zone || 'Chetumal', tipo || 'local', proteccion, dificultades)
  res.json(result)
})

module.exports = { analyze, calculate }
