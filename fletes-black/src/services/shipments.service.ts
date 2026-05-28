import api from '@/services/api'

export type FreightStatus =
  | 'PUBLISHED'
  | 'ASSIGNED'
  | 'IN_COLLECTION'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CLOSED'
  | 'CANCELLED'

export interface Shipment {
  id: number
  folio: string
  status: FreightStatus
  originCity: string
  destinationCity: string
  estimatedPickupDate: string
  totalPrice: number
  createdAt: string
}

export interface CreateShipmentPayload {
  originAddress: string
  originCity: string
  destinationAddress: string
  destinationCity: string
  cargoType?: string
  paymentPreference?: string
  totalPrice?: number
  items?: Array<{
    name: string
    category: 'pequeño' | 'mediano' | 'grande' | 'extra_grande'
    weightKg?: number
    difficulty: 'normal' | 'moderada' | 'alta'
    basePrice: number
    subtotal: number
    aiConfidence?: number
  }>
}

const mapShipment = (s: any): Shipment => ({
  id: s.id,
  folio: s.trackingFolio ?? s.folio ?? `${s.id}`,
  status: s.status,
  originCity: s.originCity,
  destinationCity: s.destinationCity,
  estimatedPickupDate: s.estimatedCollectionAt ?? s.estimatedPickupDate ?? s.createdAt,
  totalPrice: Number(s.finalPrice ?? s.basePrice ?? 0),
  createdAt: s.createdAt,
})

export const getMyShipments = async (): Promise<Shipment[]> => {
  const { data } = await api.get('/shipments/mine')
  const list: any[] = data.shipments ?? data
  return list.map(mapShipment)
}

export const createShipment = async (payload: CreateShipmentPayload): Promise<Shipment> => {
  const { data } = await api.post('/shipments', payload)
  return mapShipment(data.shipment ?? data)
}

export const cancelShipment = async (id: number, reason: string): Promise<void> => {
  await api.patch(`/shipments/${id}/cancel`, { reason })
}

export interface AdminShipment extends Shipment {
  shipper?: { id: number; firstName: string; lastName: string }
  paymentPreference?: string | null
}

const mapAdminShipment = (s: any): AdminShipment => ({
  ...mapShipment(s),
  shipper: s.shipper,
  paymentPreference: s.paymentPreference ?? null,
})

export const getAllShipments = async (): Promise<AdminShipment[]> => {
  const { data } = await api.get('/shipments')
  const list: any[] = data.shipments ?? data
  return list.map(mapAdminShipment)
}

export const updateShipmentStatus = async (id: number, status: FreightStatus, changeReason?: string): Promise<void> => {
  await api.patch(`/shipments/${id}/status`, { status, changeReason })
}

export const updateShipmentPrice = async (id: number, price: number): Promise<void> => {
  await api.patch(`/shipments/${id}/price`, { price })
}
