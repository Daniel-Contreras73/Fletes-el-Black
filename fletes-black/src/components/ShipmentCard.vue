<template>
  <div
    class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
    @click="emit('select', shipment)"
  >
    <!-- Encabezado: folio + badge de estado -->
    <div class="flex items-start justify-between mb-3">
      <div>
        <p class="font-bold text-gray-900 text-sm">{{ shipment.folio }}</p>
        <p class="text-xs text-gray-500 mt-0.5">{{ route }}</p>
      </div>
      <span :class="statusClass" class="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ml-2">
        {{ statusLabel }}
      </span>
    </div>

    <!-- Pie: fecha + precio + botón cancelar -->
    <div class="flex items-center justify-between pt-3 border-t border-gray-50">
      <p class="text-xs text-gray-400">{{ formattedDate }}</p>
      <div class="flex items-center gap-3">
        <p class="font-semibold text-gray-800">${{ shipment.totalPrice.toLocaleString('es-MX') }}</p>
        //solo muestra el boton si el flete todavia se puede cancelar
        <button
          v-if="canCancel"
          @click.stop="emit('cancel', shipment.id)"
          class="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Tarjeta de flete — muestra el folio, ruta, estado, fecha y precio de un flete.
// Se usa en la vista de Mis Fletes para listar los fletes del cliente con opción a cancelar.
import { computed } from 'vue'
import type { Shipment } from '@/services/shipments.service'

// Props — datos que recibe del componente padre
const props = defineProps<{ shipment: Shipment }>()

// Emits — eventos que envía al componente padre
const emit = defineEmits<{
  select: [shipment: Shipment]
  cancel: [id: number]
}>()

// Computed — valores derivados de los props
const route = computed(
  () => `${props.shipment.originCity} → ${props.shipment.destinationCity}`
)

const formattedDate = computed(() =>
  new Date(props.shipment.estimatedPickupDate).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
)

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    PUBLISHED: 'Publicado',
    ASSIGNED: 'Asignado',
    IN_COLLECTION: 'En recolección',
    IN_TRANSIT: 'En tránsito',
    DELIVERED: 'Entregado',
    CLOSED: 'Cerrado',
    CANCELLED: 'Cancelado'
  }
  return labels[props.shipment.status] ?? props.shipment.status
})

//satusclass es una variable computed que devuelve un objeto con clases Css
const statusClass = computed(() => ({
  'bg-yellow-100 text-yellow-700': props.shipment.status === 'PUBLISHED',
  'bg-blue-100 text-blue-700': props.shipment.status === 'ASSIGNED',
  'bg-orange-100 text-orange-700': props.shipment.status === 'IN_COLLECTION',
  'bg-purple-100 text-purple-700': props.shipment.status === 'IN_TRANSIT',
  'bg-green-100 text-green-700': props.shipment.status === 'DELIVERED',
  'bg-gray-100 text-gray-600': props.shipment.status === 'CLOSED',
  'bg-red-100 text-red-600': props.shipment.status === 'CANCELLED'
}))

// Solo se puede cancelar si el flete aún no fue asignado o está publicado
const canCancel = computed(() =>
  ['PUBLISHED', 'ASSIGNED'].includes(props.shipment.status)
)
</script>
