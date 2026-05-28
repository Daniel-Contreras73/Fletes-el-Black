const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Devuelve los fletes aceptados del cliente como "pagos"
const getMyPayments = async (userId) => {
  const freights = await prisma.freight.findMany({
    where: {
      shipperId: userId,
      status: { in: ['ASSIGNED', 'IN_COLLECTION', 'IN_TRANSIT', 'DELIVERED', 'CLOSED', 'CANCELLED'] }
    },
    select: {
      id: true,
      trackingFolio: true,
      originCity: true,
      destinationCity: true,
      finalPrice: true,
      status: true,
      paymentPreference: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' }
  })

  return freights.map(f => ({
    freightId: f.id,
    folio: f.trackingFolio,
    originCity: f.originCity,
    destinationCity: f.destinationCity,
    amount: Number(f.finalPrice ?? 0),
    freightStatus: f.status,
    paymentPreference: f.paymentPreference ?? null,
    paymentStatus: ['DELIVERED', 'CLOSED'].includes(f.status) ? 'PAID' : f.status === 'CANCELLED' ? 'CANCELLED' : 'PENDING',
    createdAt: f.createdAt,
  }))
}

const savePreference = async (freightId, userId, preference) => {
  // Verificar que el flete pertenece al usuario
  const freight = await prisma.freight.findFirst({
    where: { id: parseInt(freightId), shipperId: userId }
  })
  if (!freight) throw new Error('Flete no encontrado')

  return prisma.freight.update({
    where: { id: parseInt(freightId) },
    data: { paymentPreference: preference }
  })
}

module.exports = { getMyPayments, savePreference }
