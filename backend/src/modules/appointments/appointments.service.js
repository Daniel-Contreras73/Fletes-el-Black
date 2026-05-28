const prisma = require('../../config/prisma')
const AppError = require('../../utils/AppError')

const create = async ({ freightId, type, scheduledAt, notes, userId, role }) => {
  const freight = await prisma.freight.findUnique({ where: { id: freightId } })
  if (!freight) throw new AppError('Flete no encontrado', 404, 'NOT_FOUND')
  if (role === 'CLIENT' && freight.shipperId !== userId) {
    throw new AppError('Sin permisos sobre este flete', 403, 'FORBIDDEN')
  }
  return prisma.appointment.create({
    data: { freightId, type, scheduledAt: new Date(scheduledAt), notes },
    include: { freight: { select: { trackingFolio: true, originCity: true, destinationCity: true } } }
  })
}

const getAll = async (userId, role) => {
  const where = role === 'ADMIN' ? {} : {
    freight: { shipperId: userId }
  }
  return prisma.appointment.findMany({
    where,
    include: { freight: { select: { trackingFolio: true, originCity: true, destinationCity: true, status: true } } },
    orderBy: { scheduledAt: 'asc' }
  })
}

const getOne = async (id, userId, role) => {
  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: { freight: { select: { trackingFolio: true, originCity: true, destinationCity: true, status: true, shipperId: true } } }
  })
  if (!appt) throw new AppError('Cita no encontrada', 404, 'NOT_FOUND')
  if (role === 'CLIENT' && appt.freight.shipperId !== userId) {
    throw new AppError('Sin permisos', 403, 'FORBIDDEN')
  }
  return appt
}

const updateStatus = async (id, status) => {
  const appt = await prisma.appointment.findUnique({ where: { id } })
  if (!appt) throw new AppError('Cita no encontrada', 404, 'NOT_FOUND')
  return prisma.appointment.update({
    where: { id },
    data: {
      status,
      confirmedAt: status === 'CONFIRMED' ? new Date() : undefined
    }
  })
}

const cancel = async (id, userId, role) => {
  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: { freight: { select: { shipperId: true } } }
  })
  if (!appt) throw new AppError('Cita no encontrada', 404, 'NOT_FOUND')
  if (role === 'CLIENT' && appt.freight.shipperId !== userId) {
    throw new AppError('Sin permisos', 403, 'FORBIDDEN')
  }
  return prisma.appointment.update({ where: { id }, data: { status: 'CANCELLED' } })
}

module.exports = { create, getAll, getOne, updateStatus, cancel }
