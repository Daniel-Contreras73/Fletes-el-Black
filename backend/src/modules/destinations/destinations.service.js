const prisma = require('../../config/prisma')
const AppError = require('../../utils/AppError')

const getAll = async (userId) => {
  return prisma.userAddress.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { id: 'desc' }]
  })
}

const create = async (userId, data) => {
  if (data.isDefault) {
    await prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } })
  }
  return prisma.userAddress.create({
    data: {
      userId,
      alias: data.alias,
      street: data.street,
      city: data.city,
      country: data.country ?? 'MX',
      lat: data.lat ?? null,
      lng: data.lng ?? null,
      isDefault: data.isDefault ?? false,
    }
  })
}

const update = async (id, userId, data) => {
  const addr = await prisma.userAddress.findUnique({ where: { id } })
  if (!addr || addr.userId !== userId) throw new AppError('Destino no encontrado', 404, 'NOT_FOUND')
  if (data.isDefault) {
    await prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } })
  }
  return prisma.userAddress.update({
    where: { id },
    data: {
      alias: data.alias,
      street: data.street,
      city: data.city,
      country: data.country,
      lat: data.lat,
      lng: data.lng,
      isDefault: data.isDefault,
    }
  })
}

const setDefault = async (id, userId) => {
  const addr = await prisma.userAddress.findUnique({ where: { id } })
  if (!addr || addr.userId !== userId) throw new AppError('Destino no encontrado', 404, 'NOT_FOUND')
  await prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } })
  return prisma.userAddress.update({ where: { id }, data: { isDefault: true } })
}

const remove = async (id, userId) => {
  const addr = await prisma.userAddress.findUnique({ where: { id } })
  if (!addr || addr.userId !== userId) throw new AppError('Destino no encontrado', 404, 'NOT_FOUND')
  await prisma.userAddress.delete({ where: { id } })
  return { deleted: true }
}

module.exports = { getAll, create, update, setDefault, remove }
