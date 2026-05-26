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

export const getMyShipments = async (): Promise<Shipment[]> => {
  const { data } = await api.get('/shipments/my-shipments')
  return data.shipments ?? data
}

export const cancelShipment = async (id: number): Promise<void> => {
  await api.post(`/shipments/${id}/cancel`)
}
