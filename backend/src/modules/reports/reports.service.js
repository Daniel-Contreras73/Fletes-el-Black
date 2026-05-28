const prisma = require('../../config/prisma')

const getSummary = async () => {
  const [totalClients, totalFreights, activeFreights, delivered, totalRevenue] = await Promise.all([
    prisma.user.count({ where: { roleId: 2 } }),
    prisma.freight.count(),
    prisma.freight.count({ where: { status: { in: ['PUBLISHED', 'ASSIGNED', 'IN_COLLECTION', 'IN_TRANSIT'] } } }),
    prisma.freight.count({ where: { status: 'DELIVERED' } }),
    prisma.freight.aggregate({ _sum: { finalPrice: true }, where: { status: { in: ['DELIVERED', 'CLOSED'] } } })
  ])
  return {
    totalClients,
    totalFreights,
    activeFreights,
    delivered,
    totalRevenueMxn: Number(totalRevenue._sum.finalPrice ?? 0)
  }
}

const getRevenue = async ({ from, to }) => {
  const where = {
    status: { in: ['DELIVERED', 'CLOSED'] },
    ...(from || to ? {
      actualDeliveryAt: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {})
      }
    } : {})
  }
  const freights = await prisma.freight.findMany({
    where,
    select: { id: true, trackingFolio: true, finalPrice: true, originCity: true, destinationCity: true, actualDeliveryAt: true, createdAt: true }
  })
  const total = freights.reduce((acc, f) => acc + Number(f.finalPrice ?? 0), 0)
  return { freights, total, count: freights.length }
}

const getShipmentStats = async () => {
  const byStatus = await prisma.freight.groupBy({
    by: ['status'],
    _count: { id: true }
  })
  const byCity = await prisma.freight.groupBy({
    by: ['originCity'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10
  })
  return { byStatus, byCity }
}

const getTopClients = async ({ limit = 10 }) => {
  const clients = await prisma.user.findMany({
    where: { roleId: 2 },
    select: {
      id: true, firstName: true, lastName: true, email: true,
      _count: { select: { freightsAsShipper: true } }
    },
    orderBy: { freightsAsShipper: { _count: 'desc' } },
    take: limit
  })
  return clients
}

module.exports = { getSummary, getRevenue, getShipmentStats, getTopClients }
