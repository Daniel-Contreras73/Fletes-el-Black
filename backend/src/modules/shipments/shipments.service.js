const shipmentsRepository = require('./shipments.repository')
const AppError = require('../../utils/AppError')

const createShipment = async (userId, data) => {
  const { items, totalPrice, ...shipmentData } = data

  const basePrice = totalPrice != null
    ? totalPrice
    : items ? items.reduce((sum, item) => sum + item.subtotal, 0) : 0

  return shipmentsRepository.create(
    { ...shipmentData, shipperId: userId, basePrice, finalPrice: basePrice },
    items || []
  )
}

const getShipment = async (id, user) => {
  const freight = await shipmentsRepository.findById(parseInt(id))
  if (!freight) throw new AppError('Flete no encontrado', 404, 'FREIGHT_NOT_FOUND')

  if (user.role !== 'ADMIN' &&
      freight.shipperId !== user.id &&
      freight.carrierId !== user.id) {
    throw new AppError('Sin acceso a este flete', 403, 'FORBIDDEN')
  }

  return freight
}

const getShipmentByFolio = async (folio) => {
  const freight = await shipmentsRepository.findByFolio(folio)
  if (!freight) throw new AppError('Flete no encontrado', 404, 'FREIGHT_NOT_FOUND')
  return freight
}

const getMyShipments = (userId, role) => {
  return shipmentsRepository.findByUser(userId, role)
}

const getAllShipments = (filters) => {
  return shipmentsRepository.findAll(filters)
}

const updateStatus = async (id, data, user) => {
  const freight = await shipmentsRepository.findById(parseInt(id))
  if (!freight) throw new AppError('Flete no encontrado', 404, 'FREIGHT_NOT_FOUND')

  const allowedTransitions = {
    PUBLISHED:     ['ASSIGNED', 'CANCELLED'],
    ASSIGNED:      ['IN_COLLECTION', 'CANCELLED'],
    IN_COLLECTION: ['IN_TRANSIT', 'CANCELLED'],
    IN_TRANSIT:    ['DELIVERED'],
    DELIVERED:     ['CLOSED'],
    CLOSED:        [],
    CANCELLED:     []
  }

  if (!allowedTransitions[freight.status]?.includes(data.status)) {
    throw new AppError(
      `No se puede cambiar de ${freight.status} a ${data.status}`,
      400,
      'INVALID_STATUS_TRANSITION'
    )
  }

  return shipmentsRepository.updateStatus(
    parseInt(id),
    data.status,
    user.id,
    data.changeReason
  )
}

const cancelShipment = async (id, reason, user) => {
  const freight = await shipmentsRepository.findById(parseInt(id))
  if (!freight) throw new AppError('Flete no encontrado', 404, 'FREIGHT_NOT_FOUND')

  if (['DELIVERED', 'CLOSED', 'CANCELLED'].includes(freight.status)) {
    throw new AppError('Este flete no puede cancelarse', 400, 'CANNOT_CANCEL')
  }

  if (user.role !== 'ADMIN' && freight.shipperId !== user.id) {
    throw new AppError('Sin permisos para cancelar este flete', 403, 'FORBIDDEN')
  }

  return shipmentsRepository.cancel(parseInt(id), user.id, reason)
}

const assignCarrier = async (freightId, bidId, user) => {
  const freight = await shipmentsRepository.findById(parseInt(freightId))
  if (!freight) throw new AppError('Flete no encontrado', 404, 'FREIGHT_NOT_FOUND')

  if (freight.status !== 'PUBLISHED') {
    throw new AppError('El flete ya no está disponible', 400, 'FREIGHT_NOT_AVAILABLE')
  }

  if (user.role !== 'ADMIN' && freight.shipperId !== user.id) {
    throw new AppError('Sin permisos para asignar transportista', 403, 'FORBIDDEN')
  }

  const bid = freight.bids?.find(b => b.id === parseInt(bidId))
  if (!bid) throw new AppError('Licitación no encontrada', 404, 'BID_NOT_FOUND')

  return shipmentsRepository.assignCarrier(
    parseInt(freightId),
    bid.carrierId,
    bid.vehicleId,
    parseInt(bidId)
  )
}

const updatePrice = async (id, price) => {
  const freight = await shipmentsRepository.findById(parseInt(id))
  if (!freight) throw new AppError('Flete no encontrado', 404, 'FREIGHT_NOT_FOUND')
  return shipmentsRepository.updatePrice(parseInt(id), price)
}

module.exports = {
  createShipment,
  getShipment,
  getShipmentByFolio,
  getMyShipments,
  getAllShipments,
  updateStatus,
  updatePrice,
  cancelShipment,
  assignCarrier
}
