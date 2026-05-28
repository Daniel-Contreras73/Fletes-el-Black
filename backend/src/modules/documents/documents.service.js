const prisma = require('../../config/prisma')
const AppError = require('../../utils/AppError')
const fs = require('fs')
const path = require('path')

const getMyDocuments = async (userId) => {
  const freights = await prisma.freight.findMany({
    where: { shipperId: userId },
    select: { id: true, trackingFolio: true }
  })
  const freightIds = freights.map(f => f.id)
  const folioMap = Object.fromEntries(freights.map(f => [f.id, f.trackingFolio]))

  const docs = await prisma.freightDocument.findMany({
    where: { freightId: { in: freightIds } },
    orderBy: { createdAt: 'desc' }
  })

  return docs.map(d => ({ ...d, folio: folioMap[d.freightId] ?? '' }))
}

const getAll = async () => {
  const docs = await prisma.freightDocument.findMany({
    include: { freight: { select: { trackingFolio: true, shipper: { select: { firstName: true, lastName: true, email: true } } } } },
    orderBy: { createdAt: 'desc' }
  })
  return docs
}

const upload = async ({ freightId, documentType, filename, uploadedBy }) => {
  const freight = await prisma.freight.findUnique({ where: { id: freightId } })
  if (!freight) throw new AppError('Flete no encontrado', 404, 'NOT_FOUND')

  return prisma.freightDocument.create({
    data: {
      freightId,
      uploadedBy,
      documentType,
      fileUrl: `/uploads/${filename}`,
      status: 'APPROVED',
      autoValidated: true,
    },
    include: { freight: { select: { trackingFolio: true } } }
  })
}

const remove = async (id) => {
  const doc = await prisma.freightDocument.findUnique({ where: { id } })
  if (!doc) throw new AppError('Documento no encontrado', 404, 'NOT_FOUND')

  const filePath = path.join('/app/uploads', path.basename(doc.fileUrl))
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

  await prisma.freightDocument.delete({ where: { id } })
  return { deleted: true }
}

module.exports = { getMyDocuments, getAll, upload, remove }
