<template>
  <div>
    <!-- Cabecera -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold tracking-widest" style="color: #E85454">MIS FLETES</h1>
      <RouterLink
        to="/shipments/new"
        class="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        style="background-color: #8B1A1A"
      >
        <span class="text-lg font-bold">+</span> Nuevo Flete
      </RouterLink>
    </div>

    <!-- Barra de búsqueda — v-model bidireccional -->
    <div class="mb-5">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por folio, ciudad de origen o destino..."
        class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
      />
    </div>

    <!-- Contador reactivo -->
    <p class="text-xs text-gray-400 mb-4">
      {{ filtered.length }} flete{{ filtered.length !== 1 ? 's' : '' }} encontrado{{ filtered.length !== 1 ? 's' : '' }}
    </p>

    <!-- Estado: cargando -->
    <div v-if="store.loading" class="flex items-center justify-center py-20 text-gray-400">
      Cargando fletes...
    </div>

    <!-- Estado: error -->
    <div v-else-if="store.error" class="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
      {{ store.error }}
    </div>

    <!-- Estado: sin resultados -->
    <div v-else-if="filtered.length === 0" class="bg-white rounded-xl p-10 text-center text-gray-400">
      <p v-if="search">No hay fletes que coincidan con "{{ search }}"</p>
      <p v-else>Aún no tienes fletes registrados</p>
    </div>

    <!-- Lista de fletes — v-for con componente hijo ShipmentCard -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ShipmentCard
        v-for="shipment in filtered"
        :key="shipment.id"
        :shipment="shipment"
        @select="goToDetail"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShipmentsStore } from '@/stores/shipments'
import ShipmentCard from '@/components/ShipmentCard.vue'
import type { Shipment } from '@/services/shipments.service'

const store = useShipmentsStore()
const router = useRouter()

// Estado local — v-model del buscador
const search = ref('')

// Hook — carga los fletes al montar la vista
onMounted(() => store.fetchMine())

// Computed — lista filtrada según el texto de búsqueda
const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return store.shipments
  return store.shipments.filter(
    (s) =>
      s.folio.toLowerCase().includes(q) ||
      s.originCity.toLowerCase().includes(q) ||
      s.destinationCity.toLowerCase().includes(q)
  )
})

// Método — navega al detalle al recibir el emit 'select'
const goToDetail = (shipment: Shipment) => {
  router.push(`/shipments/${shipment.id}`)
}

// Método — cancela el flete al recibir el emit 'cancel'
const handleCancel = async (id: number) => {
  if (!confirm('¿Seguro que quieres cancelar este flete?')) return
  await store.cancel(id)
}
</script>
