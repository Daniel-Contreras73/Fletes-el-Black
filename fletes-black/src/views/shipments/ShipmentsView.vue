<template>
  <div>
    <!-- Cabecera -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold tracking-widest" style="color: #DC2626">MIS FLETES</h1>
      <RouterLink to="/shipments/new"
        class="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        style="background-color: #991B1B">
        <span class="text-lg font-bold">+</span> Nuevo Flete
      </RouterLink>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-5 flex-wrap">
      <button v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        :class="activeTab === tab.id
          ? 'text-white font-semibold'
          : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300'"
        :style="activeTab === tab.id ? 'background-color: #DC2626' : ''"
        class="px-4 py-2 rounded-lg text-sm transition-colors">
        {{ tab.label }} ({{ tab.count }})
      </button>
    </div>

    <!-- Filtros -->
    <div class="flex gap-3 mb-5 flex-wrap">
      <input v-model="search" type="text"
        placeholder="Búsqueda Avanzada (Folio, Ruta, Transportista)"
        class="flex-1 min-w-48 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
      <input v-model="dateFilter" type="text" placeholder="Fecha: DD/MM/AAAA – DD/MM/AAAA"
        class="w-56 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
      <input v-model="transporterFilter" type="text" placeholder="Filtrar Por Transportista"
        class="w-48 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
    </div>

    <!-- Estado: cargando -->
    <div v-if="store.loading" class="flex items-center justify-center py-16 text-gray-400">
      Cargando fletes...
    </div>

    <!-- Tabla -->
    <div v-else class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <p class="px-5 py-3 text-xs font-bold text-gray-500 tracking-wider border-b border-gray-100">
        LISTADO DETALLADO DE FLETES
      </p>
      <table class="w-full text-sm">
        <thead style="background-color: #DC2626">
          <tr>
            <th class="text-left px-5 py-3 font-medium text-white">ID/Folio</th>
            <th class="text-left px-5 py-3 font-medium text-white">Fecha Creación</th>
            <th class="text-left px-5 py-3 font-medium text-white">Ruta: Origen → Destino</th>
            <th class="text-left px-5 py-3 font-medium text-white">Costo</th>
            <th class="text-left px-5 py-3 font-medium text-white">Estado</th>
            <th class="text-left px-5 py-3 font-medium text-white">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Si no hay fletes en el array filtered, muestra un mensaje según si hay búsqueda activa o no -->
          <tr v-if="filtered.length === 0">
            <td colspan="6" class="text-center py-12 text-gray-400">
              {{ search ? 'No hay resultados para la búsqueda' : 'No hay fletes en esta categoría' }}
            </td>
          </tr>

          <!-- Por cada flete en filtered crea una fila. :key ayuda a Vue a identificar cada fila -->
          <!-- :style alterna el color de fondo entre filas pares e impares (efecto rayado) -->
          <tr v-for="shipment in filtered" :key="shipment.id"
            class="border-b border-red-50 hover:bg-red-50 transition-colors"
            :style="rowIndex(shipment.id) % 2 === 0 ? 'background-color: #FFF5F5' : ''">

            <!-- Folio del flete — número identificador -->
            <td class="px-5 py-4 font-semibold text-gray-800">Folio #{{ shipment.folio }}</td>

            <!-- Fecha de creación formateada con la función formatDate -->
            <td class="px-5 py-4 text-gray-600">{{ formatDate(shipment.createdAt) }}</td>

            <!-- Ruta: ciudad de origen → ciudad de destino -->
            <td class="px-5 py-4 text-gray-700 font-medium">{{ shipment.originCity }} → {{ shipment.destinationCity }}</td>

            <!-- Precio total formateado en pesos mexicanos -->
            <td class="px-5 py-4 font-semibold text-gray-800">${{ shipment.totalPrice.toLocaleString('es-MX') }}</td>

            <!-- Badge de estado — :class aplica el color según el estado del flete -->
            <td class="px-5 py-4">
              <span :class="statusClass(shipment.status)" class="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                <!-- Punto de color al lado del texto del estado -->
                <span class="w-2 h-2 rounded-full" :class="statusDot(shipment.status)" />
                <!-- Texto del estado traducido al español (ej. DELIVERED → "Entregado") -->
                {{ statusLabel(shipment.status) }}
              </span>
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2 flex-wrap">
                <!-- En tránsito / En recolección / Asignado: Ver Mapa -->
                <button v-if="['IN_TRANSIT','IN_COLLECTION','ASSIGNED'].includes(shipment.status)"
                  class="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-100 flex items-center gap-1">
                  🌐 Ver Mapa
                </button>
                <!-- En tránsito: Incidente -->
                <button v-if="shipment.status === 'IN_TRANSIT'"
                  class="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2 py-1 rounded-lg hover:bg-orange-100">
                  ⚠️ Incidente
                </button>
                <!-- Publicado: Detalles + Ofertas -->
                <button v-if="shipment.status === 'PUBLISHED'"
                  @click="goToDetail(shipment.id)"
                  class="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-100">
                  📄 Detalles
                </button>
                <button v-if="shipment.status === 'PUBLISHED'"
                  class="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded-lg hover:bg-green-100">
                  ✓ Ofertas
                </button>
                <!-- Entregado/Cerrado: Detalles + Docs -->
                <button v-if="['DELIVERED','CLOSED'].includes(shipment.status)"
                  @click="goToDetail(shipment.id)"
                  class="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-100">
                  📄 Detalles
                </button>
                <button v-if="['DELIVERED','CLOSED'].includes(shipment.status)"
                  class="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-100">
                  ⬇ Desc. Docs.
                </button>
                <!-- Cancelado -->
                <span v-if="shipment.status === 'CANCELLED'" class="text-xs text-gray-300">—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShipmentsStore } from '@/stores/shipments'
import type { Shipment } from '@/services/shipments.service'

const store = useShipmentsStore()
const router = useRouter()

const activeTab = ref<'activos' | 'licitando' | 'completados' | 'cancelados'>('activos')
const search = ref('')
const dateFilter = ref('')
const transporterFilter = ref('')

onMounted(() => store.fetchMine())

// Conteo por tab
const countActivos = computed(() => store.shipments.filter(s => ['ASSIGNED','IN_COLLECTION','IN_TRANSIT'].includes(s.status)).length)
const countLicitando = computed(() => store.shipments.filter(s => s.status === 'PUBLISHED').length)
const countCompletados = computed(() => store.shipments.filter(s => ['DELIVERED','CLOSED'].includes(s.status)).length)
const countCancelados = computed(() => store.shipments.filter(s => s.status === 'CANCELLED').length)

const tabs = computed(() => [
  { id: 'activos' as const, label: 'Activos', count: countActivos.value },
  { id: 'licitando' as const, label: 'Licitando', count: countLicitando.value },
  { id: 'completados' as const, label: 'Completados', count: countCompletados.value },
  { id: 'cancelados' as const, label: 'Cancelados', count: countCancelados.value },
])

const byTab = computed(() => {
  const all = store.shipments
  if (activeTab.value === 'activos') return all.filter(s => ['ASSIGNED','IN_COLLECTION','IN_TRANSIT'].includes(s.status))
  if (activeTab.value === 'licitando') return all.filter(s => s.status === 'PUBLISHED')
  if (activeTab.value === 'completados') return all.filter(s => ['DELIVERED','CLOSED'].includes(s.status))
  return all.filter(s => s.status === 'CANCELLED')
})

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return byTab.value
  return byTab.value.filter(s =>
    s.folio.toLowerCase().includes(q) ||
    s.originCity.toLowerCase().includes(q) ||
    s.destinationCity.toLowerCase().includes(q)
  )
})

const rowIndex = (id: number) => filtered.value.findIndex(s => s.id === id)

const goToDetail = (id: number) => router.push(`/shipments/${id}`)

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })

const statusLabel = (s: Shipment['status']) => ({
  PUBLISHED: 'Licitando', ASSIGNED: 'Asignado', IN_COLLECTION: 'En recolección',
  IN_TRANSIT: 'En tránsito', DELIVERED: 'Completo', CLOSED: 'Cerrado', CANCELLED: 'Cancelado',
}[s] ?? s)

const statusClass = (s: Shipment['status']) => ({
  PUBLISHED: 'bg-yellow-800 text-yellow-100',
  ASSIGNED: 'bg-yellow-500 text-white',
  IN_COLLECTION: 'bg-orange-500 text-white',
  IN_TRANSIT: 'bg-green-700 text-white',
  DELIVERED: 'bg-blue-600 text-white',
  CLOSED: 'bg-gray-500 text-white',
  CANCELLED: 'bg-red-700 text-white',
}[s] ?? 'bg-gray-200 text-gray-700')

const statusDot = (s: Shipment['status']) => ({
  PUBLISHED: 'bg-yellow-300', ASSIGNED: 'bg-yellow-200', IN_COLLECTION: 'bg-orange-300',
  IN_TRANSIT: 'bg-green-300', DELIVERED: 'bg-blue-300', CLOSED: 'bg-gray-300', CANCELLED: 'bg-red-300',
}[s] ?? 'bg-gray-300')
</script>
