const prisma = require('../../config/prisma')
const AppError = require('../../utils/AppError')

const CLIENT_ROLE_ID = 2

const getAll = async ({ search, page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit
  const where = {
    roleId: CLIENT_ROLE_ID,
    ...(search ? {
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ]
    } : {})
  }
  const [clients, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, firstName: true, lastName: true, email: true,
        phone: true, isActive: true, createdAt: true,
        _count: { select: { freightsAsShipper: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip, take: limit
    }),
    prisma.user.count({ where })
  ])
  return { clients, total, page, pages: Math.ceil(total / limit) }
}

const getOne = async (id) => {
  const client = await prisma.user.findFirst({
    where: { id, roleId: CLIENT_ROLE_ID },
    select: {
      id: true, firstName: true, lastName: true, email: true,
      phone: true, isActive: true, createdAt: true,
      freightsAsShipper: {
        select: { id: true, trackingFolio: true, status: true, originCity: true, destinationCity: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      addresses: true
    }
  })
  if (!client) throw new AppError('Cliente no encontrado', 404, 'NOT_FOUND')
  return client
}

const update = async (id, data) => {
  const client = await prisma.user.findFirst({ where: { id, roleId: CLIENT_ROLE_ID } })
  if (!client) throw new AppError('Cliente no encontrado', 404, 'NOT_FOUND')
  return prisma.user.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    },
    select: { id: true, firstName: true, lastName: true, email: true, phone: true, isActive: true }
  })
}

const deactivate = async (id) => {
  const client = await prisma.user.findFirst({ where: { id, roleId: CLIENT_ROLE_ID } })
  if (!client) throw new AppError('Cliente no encontrado', 404, 'NOT_FOUND')
  return prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: { id: true, isActive: true }
  })
}

module.exports = { getAll, getOne, update, deactivate }
