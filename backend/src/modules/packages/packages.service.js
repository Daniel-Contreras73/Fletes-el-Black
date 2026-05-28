const prisma = require('../../config/prisma')
const AppError = require('../../utils/AppError')

const getAll = async (userId, role) => {
  const where = role === 'ADMIN' ? {} : {
    freight: { shipperId: userId }
  }
  return prisma.freightItem.findMany({
    where,
    include: { freight: { select: { trackingFolio: true, status: true, shipperId: true } } },
    orderBy: { createdAt: 'desc' }
  })
}

const getOne = async (id, userId, role) => {
  const pkg = await prisma.freightItem.findUnique({
    where: { id },
    include: { freight: { select: { trackingFolio: true, status: true, shipperId: true } } }
  })
  if (!pkg) throw new AppError('Paquete no encontrado', 404, 'NOT_FOUND')
  if (role === 'CLIENT' && pkg.freight.shipperId !== userId) {
    throw new AppError('Sin permisos', 403, 'FORBIDDEN')
  }
  return pkg
}

const create = async (data, userId, role) => {
  const freight = await prisma.freight.findUnique({ where: { id: data.freightId } })
  if (!freight) throw new AppError('Flete no encontrado', 404, 'NOT_FOUND')
  if (role === 'CLIENT' && freight.shipperId !== userId) {
    throw new AppError('Sin permisos sobre este flete', 403, 'FORBIDDEN')
  }
  return prisma.freightItem.create({
    data: {
      freightId: data.freightId,
      name: data.name,
      category: data.category,
      weightKg: data.weightKg,
      lengthCm: data.lengthCm,
      widthCm: data.widthCm,
      heightCm: data.heightCm,
      isIrregular: data.isIrregular ?? false,
      difficulty: data.difficulty ?? 'normal',
      basePrice: data.basePrice,
      difficultyCharge: data.difficultyCharge ?? 0,
      irregularCharge: data.irregularCharge ?? 0,
      subtotal: data.subtotal,
      aiConfidence: data.aiConfidence,
      priceNote: data.priceNote,
    }
  })
}

const update = async (id, data, userId, role) => {
  const pkg = await prisma.freightItem.findUnique({
    where: { id },
    include: { freight: { select: { shipperId: true, status: true } } }
  })
  if (!pkg) throw new AppError('Paquete no encontrado', 404, 'NOT_FOUND')
  if (role === 'CLIENT' && pkg.freight.shipperId !== userId) {
    throw new AppError('Sin permisos', 403, 'FORBIDDEN')
  }
  return prisma.freightItem.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category,
      weightKg: data.weightKg,
      difficulty: data.difficulty,
      basePrice: data.basePrice,
      subtotal: data.subtotal,
      priceNote: data.priceNote,
    }
  })
}

const remove = async (id, userId, role) => {
  const pkg = await prisma.freightItem.findUnique({
    where: { id },
    include: { freight: { select: { shipperId: true } } }
  })
  if (!pkg) throw new AppError('Paquete no encontrado', 404, 'NOT_FOUND')
  if (role === 'CLIENT' && pkg.freight.shipperId !== userId) {
    throw new AppError('Sin permisos', 403, 'FORBIDDEN')
  }
  await prisma.freightItem.delete({ where: { id } })
  return { deleted: true }
}

module.exports = { getAll, getOne, create, update, remove }
