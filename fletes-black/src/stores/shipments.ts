import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMyShipments, createShipment, cancelShipment, getAllShipments, updateShipmentStatus, updateShipmentPrice } from '@/services/shipments.service'
import type { Shipment, AdminShipment, CreateShipmentPayload, FreightStatus } from '@/services/shipments.service'

export const useShipmentsStore = defineStore('shipments', () => {
  const shipments = ref<Shipment[]>([])
  const adminShipments = ref<AdminShipment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMine = async () => {
    loading.value = true
    error.value = null
    try {
      shipments.value = await getMyShipments()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar fletes'
    } finally {
      loading.value = false
    }
  }

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      adminShipments.value = await getAllShipments()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar fletes'
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: CreateShipmentPayload): Promise<Shipment> => {
    const shipment = await createShipment(payload)
    shipments.value.unshift(shipment)
    return shipment
  }

  const cancel = async (id: number) => {
    await cancelShipment(id, 'Cancelado por el cliente')
    shipments.value = shipments.value.map((s) =>
      s.id === id ? { ...s, status: 'CANCELLED' as const } : s
    )
  }

  const changeStatus = async (id: number, status: FreightStatus) => {
    await updateShipmentStatus(id, status)
    adminShipments.value = adminShipments.value.map((s) =>
      s.id === id ? { ...s, status } : s
    )
  }

  const changePrice = async (id: number, price: number) => {
    await updateShipmentPrice(id, price)
    adminShipments.value = adminShipments.value.map((s) =>
      s.id === id ? { ...s, totalPrice: price } : s
    )
  }

  const total = computed(() => shipments.value.length)
  const active = computed(() => shipments.value.filter((s) => !['DELIVERED', 'CLOSED', 'CANCELLED'].includes(s.status)).length)
  const delivered = computed(() => shipments.value.filter((s) => s.status === 'DELIVERED').length)
  const cancelled = computed(() => shipments.value.filter((s) => s.status === 'CANCELLED').length)
  const recent = computed(() => [...shipments.value].slice(0, 4))

  return { shipments, adminShipments, loading, error, total, active, delivered, cancelled, recent, fetchMine, fetchAll, create, cancel, changeStatus, changePrice }
})
