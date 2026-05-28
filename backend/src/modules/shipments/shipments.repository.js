const prisma = require('../../config/prisma')

const generateFolio = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let folio = 'FL-'
  for (let i = 0; i < 8; i++) {
    folio += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return folio
}

const create = async (data, items = []) => {
  const folio = generateFolio()

  return prisma.freight.create({
    data: {
      trackingFolio: folio,
      shipperId: data.shipperId,
      originAddress: data.originAddress,
      originCity: data.originCity,
      originLat: data.originLat,
      originLng: data.originLng,
      destinationAddress: data.destinationAddress,
      destinationCity: data.destinationCity,
      destinationLat: data.destinationLat,
      destinationLng: data.destinationLng,
      cargoType: data.cargoType,
      paymentPreference: data.paymentPreference,
      estimatedCollectionAt: data.estimatedCollectionAt,
      bidDeadline: data.bidDeadline,
      categoryId: data.categoryId,
      basePrice: data.basePrice,
      finalPrice: data.finalPrice,
      pricingMethod: 'AI',
      freightItems: {
        create: items
      }
    },
    include: { freightItems: true }
  })
}

const findById = (id) => {
  return prisma.freight.findUnique({
    where: { id },
    include: {
      freightItems: true,
      shipper: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true }
      },
      carrier: {
        select: { id: true, firstName: true, lastName: true, phone: true }
      },
      vehicle: true,
      category: true,
      payment: true
    }
  })
}

const findByFolio = (folio) => {
  return prisma.freight.findUnique({
    where: { trackingFolio: folio },
    include: {
      freightItems: true,
      shipper: {
        select: { id: true, firstName: true, lastName: true }
      }
    }
  })
}

const findByUser = (userId, role) => {
  const where = role === 'TRANSPORTER'
    ? { carrierId: userId }
    : { shipperId: userId }

  return prisma.freight.findMany({
    where,
    include: { freightItems: true, category: true },
    orderBy: { createdAt: 'desc' }
  })
}

const findAll = (filters = {}) => {
  return prisma.freight.findMany({
    where: filters,
    include: {
      freightItems: true,
      shipper: {
        select: { id: true, firstName: true, lastName: true }
      },
      category: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

const updateStatus = (id, status, changedBy, changeReason) => {
  return prisma.$transaction(async (tx) => {
    const freight = await tx.freight.findUnique({
      where: { id }
    })

    const updated = await tx.freight.update({
      where: { id },
      data: { status }
    })

    await tx.freightStatusHistory.create({
      data: {
        freightId: id,
        fromStatus: freight.status,
        toStatus: status,
        changedBy,
        changeReason
      }
    })

    return updated
  })
}

const cancel = (id, cancelledBy, reason) => {
  return prisma.$transaction(async (tx) => {
    const freight = await tx.freight.findUnique({
      where: { id }
    })

    const updated = await tx.freight.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledBy
      }
    })

    await tx.freightStatusHistory.create({
      data: {
        freightId: id,
        fromStatus: freight.status,
        toStatus: 'CANCELLED',
        changedBy: cancelledBy,
        changeReason: reason
      }
    })

    return updated
  })
}

const assignCarrier = (freightId, carrierId, vehicleId, bidId) => {
  return prisma.$transaction(async (tx) => {
    const freight = await tx.freight.update({
      where: { id: freightId },
      data: { carrierId, vehicleId, status: 'ASSIGNED' }
    })

    await tx.bid.update({
      where: { id: bidId },
      data: { status: 'ACCEPTED', respondedAt: new Date() }
    })

    await tx.freightStatusHistory.create({
      data: {
        freightId,
        fromStatus: 'PUBLISHED',
        toStatus: 'ASSIGNED',
        changedBy: carrierId,
        changeReason: 'Transportista asignado'
      }
    })

    return freight
  })
}

const updatePrice = (id, finalPrice) => {
  return prisma.freight.update({
    where: { id },
    data: { finalPrice, basePrice: finalPrice }
  })
}

module.exports = {
  create,
  findById,
  findByFolio,
  findByUser,
  findAll,
  updateStatus,
  updatePrice,
  cancel,
  assignCarrier
}
