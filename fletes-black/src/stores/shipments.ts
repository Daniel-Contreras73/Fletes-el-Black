import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMyShipments, cancelShipment } from '@/services/shipments.service'
import type { Shipment } from '@/services/shipments.service'

export const useShipmentsStore = defineStore('shipments', () => {
  const shipments = ref<Shipment[]>([])
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

  const cancel = async (id: number) => {
    await cancelShipment(id)
    shipments.value = shipments.value.map((s) =>
      s.id === id ? { ...s, status: 'CANCELLED' as const } : s
    )
  }

  const total = computed(() => shipments.value.length)

  const active = computed(
    () =>
      shipments.value.filter((s) => !['DELIVERED', 'CLOSED', 'CANCELLED'].includes(s.status)).length
  )

  const delivered = computed(
    () => shipments.value.filter((s) => s.status === 'DELIVERED').length
  )

  const cancelled = computed(
    () => shipments.value.filter((s) => s.status === 'CANCELLED').length
  )

  const recent = computed(() => [...shipments.value].slice(0, 4))

  return { shipments, loading, error, total, active, delivered, cancelled, recent, fetchMine, cancel }
})
