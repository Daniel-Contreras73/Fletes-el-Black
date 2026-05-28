<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold tracking-widest" style="color: #DC2626">GESTIÓN DE FLETES</h1>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-5 flex-wrap">
      <button v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        :class="activeTab === tab.id ? 'text-white font-semibold' : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300'"
        :style="activeTab === tab.id ? 'background-color: #DC2626' : ''"
        class="px-4 py-2 rounded-lg text-sm transition-colors">
        {{ tab.label }} ({{ tab.count }})
      </button>
    </div>

    <!-- Búsqueda -->
    <div class="flex gap-3 mb-5">
      <input v-model="search" type="text" placeholder="Buscar por folio, cliente o ruta..."
        class="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex justify-center py-16 text-gray-400">
      Cargando fletes...
    </div>

    <!-- Tabla -->
    <div v-else class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <p class="px-5 py-3 text-xs font-bold text-gray-500 tracking-wider border-b border-gray-100">
        LISTADO DE FLETES
      </p>
      <table class="w-full text-sm">
        <thead style="background-color: #DC2626">
          <tr>
            <th class="text-left px-5 py-3 font-medium text-white">Folio</th>
            <th class="text-left px-5 py-3 font-medium text-white">Cliente</th>
            <th class="text-left px-5 py-3 font-medium text-white">Ruta</th>
            <th class="text-left px-5 py-3 font-medium text-white">Fecha</th>
            <th class="text-left px-5 py-3 font-medium text-white">Precio</th>
            <th class="text-left px-5 py-3 font-medium text-white">Estado</th>
            <th class="text-left px-5 py-3 font-medium text-white">Pago</th>
            <th class="text-left px-5 py-3 font-medium text-white">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filtered.length === 0">
            <td colspan="8" class="text-center py-12 text-gray-400">No hay fletes en esta categoría</td>
          </tr>
          <tr v-for="(s, i) in filtered" :key="s.id"
            class="border-b border-red-50 hover:bg-red-50 transition-colors"
            :style="i % 2 === 0 ? 'background-color: #FFF5F5' : ''">

            <td class="px-5 py-4 font-mono text-xs text-red-600 font-semibold">{{ s.folio }}</td>

            <td class="px-5 py-4 text-gray-700">
              {{ s.shipper ? `${s.shipper.firstName} ${s.shipper.lastName}` : '—' }}
            </td>

            <td class="px-5 py-4 text-gray-700 font-medium">
              {{ s.originCity }} → {{ s.destinationCity }}
            </td>

            <td class="px-5 py-4 text-gray-500 text-xs">{{ formatDate(s.createdAt) }}</td>

            <td class="px-5 py-4 font-semibold text-gray-800">
              ${{ s.totalPrice.toLocaleString('es-MX') }}
            </td>

            <td class="px-5 py-4">
              <span :class="statusClass(s.status)" class="px-2 py-1 rounded-full text-xs font-semibold w-fit block">
                {{ statusLabel(s.status) }}
              </span>
            </td>

            <td class="px-5 py-4 text-xs text-gray-500">
              {{ s.paymentPreference === 'AL_RECOGER' ? '📦 Al recoger' : s.paymentPreference === 'AL_ENTREGAR' ? '🚛 Al entregar' : '—' }}
            </td>

            <td class="px-5 py-4">
              <div class="flex items-center gap-1.5 flex-wrap">

                <!-- PUBLISHED: aceptar, precio, rechazar -->
                <template v-if="s.status === 'PUBLISHED'">
                  <button @click="accept(s.id)"
                    class="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-lg hover:bg-green-100 font-semibold">
                    ✓ Aceptar
                  </button>
                  <button @click="openPrice(s)"
                    class="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-100">
                    $ Precio
                  </button>
                  <button @click="reject(s.id)"
                    class="text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-100">
                    ✕ Rechazar
                  </button>
                </template>

                <!-- ASSIGNED: ir a recolección -->
                <template v-else-if="s.status === 'ASSIGNED'">
                  <button @click="advance(s.id, 'IN_COLLECTION')"
                    class="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-1 rounded-lg hover:bg-orange-100 font-semibold">
                    📦 Recoger
                  </button>
                  <button @click="reject(s.id)"
                    class="text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-100">
                    ✕ Cancelar
                  </button>
                </template>

                <!-- IN_COLLECTION: en tránsito -->
                <template v-else-if="s.status === 'IN_COLLECTION'">
                  <button @click="advance(s.id, 'IN_TRANSIT')"
                    class="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-100 font-semibold">
                    🚛 En tránsito
                  </button>
                </template>

                <!-- IN_TRANSIT: entregado -->
                <template v-else-if="s.status === 'IN_TRANSIT'">
                  <button @click="advance(s.id, 'DELIVERED')"
                    class="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-lg hover:bg-green-100 font-semibold">
                    ✓ Entregado
                  </button>
                </template>

                <!-- DELIVERED: cerrar -->
                <template v-else-if="s.status === 'DELIVERED'">
                  <button @click="advance(s.id, 'CLOSED')"
                    class="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-200">
                    Cerrar
                  </button>
                </template>

                <span v-else class="text-xs text-gray-300">—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal cambio de precio -->
    <div v-if="priceModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-7 w-full max-w-sm shadow-xl">
        <h2 class="text-lg font-bold text-gray-800 mb-1">Cambiar precio</h2>
        <p class="text-sm text-gray-500 mb-4">
          Flete <span class="font-mono text-red-600">{{ priceTarget?.folio }}</span>
          · {{ priceTarget?.originCity }} → {{ priceTarget?.destinationCity }}
        </p>
        <label class="block text-red-500 text-sm font-medium mb-1">Nuevo precio (MXN)</label>
        <input v-model.number="newPrice" type="number" min="1" placeholder="500"
          class="w-full border border-red-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 mb-1" />
        <p v-if="priceError" class="text-red-500 text-xs mt-1 mb-2">{{ priceError }}</p>
        <div class="flex gap-3 mt-4">
          <button @click="priceModal = false"
            class="flex-1 border-2 border-red-300 text-red-500 py-2.5 rounded-xl font-semibold hover:bg-red-50">
            Cancelar
          </button>
          <button @click="savePrice" :disabled="savingPrice"
            class="flex-1 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-40"
            style="background-color: #DC2626">
            {{ savingPrice ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useShipmentsStore } from '@/stores/shipments'
import type { AdminShipment, FreightStatus } from '@/services/shipments.service'

const store = useShipmentsStore()
const search = ref('')
const activeTab = ref<'nuevos' | 'enproceso' | 'completados' | 'cancelados'>('nuevos')

// Modal precio
const priceModal = ref(false)
const priceTarget = ref<AdminShipment | null>(null)
const newPrice = ref<number | null>(null)
const priceError = ref('')
const savingPrice = ref(false)

onMounted(() => store.fetchAll())

const countNuevos = computed(() => store.adminShipments.filter(s => s.status === 'PUBLISHED').length)
const countEnProceso = computed(() => store.adminShipments.filter(s => ['ASSIGNED', 'IN_COLLECTION', 'IN_TRANSIT'].includes(s.status)).length)
const countCompletados = computed(() => store.adminShipments.filter(s => ['DELIVERED', 'CLOSED'].includes(s.status)).length)
const countCancelados = computed(() => store.adminShipments.filter(s => s.status === 'CANCELLED').length)

const tabs = computed(() => [
  { id: 'nuevos' as const,      label: 'Nuevos',       count: countNuevos.value },
  { id: 'enproceso' as const,   label: 'En proceso',   count: countEnProceso.value },
  { id: 'completados' as const, label: 'Completados',  count: countCompletados.value },
  { id: 'cancelados' as const,  label: 'Cancelados',   count: countCancelados.value },
])

const byTab = computed(() => {
  const all = store.adminShipments
  if (activeTab.value === 'nuevos')      return all.filter(s => s.status === 'PUBLISHED')
  if (activeTab.value === 'enproceso')   return all.filter(s => ['ASSIGNED', 'IN_COLLECTION', 'IN_TRANSIT'].includes(s.status))
  if (activeTab.value === 'completados') return all.filter(s => ['DELIVERED', 'CLOSED'].includes(s.status))
  return all.filter(s => s.status === 'CANCELLED')
})

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return byTab.value
  return byTab.value.filter(s =>
    s.folio.toLowerCase().includes(q) ||
    s.originCity.toLowerCase().includes(q) ||
    s.destinationCity.toLowerCase().includes(q) ||
    `${(s as AdminShipment).shipper?.firstName} ${(s as AdminShipment).shipper?.lastName}`.toLowerCase().includes(q)
  )
})

const accept = async (id: number) => {
  await store.changeStatus(id, 'ASSIGNED')
}

const reject = async (id: number) => {
  if (!confirm('¿Rechazar/cancelar este flete?')) return
  await store.changeStatus(id, 'CANCELLED')
}

const advance = async (id: number, status: FreightStatus) => {
  await store.changeStatus(id, status)
}

const openPrice = (s: AdminShipment) => {
  priceTarget.value = s
  newPrice.value = s.totalPrice
  priceError.value = ''
  priceModal.value = true
}

const savePrice = async () => {
  priceError.value = ''
  if (!newPrice.value || newPrice.value <= 0) { priceError.value = 'Ingresa un precio válido'; return }
  savingPrice.value = true
  try {
    await store.changePrice(priceTarget.value!.id, newPrice.value)
    priceModal.value = false
  } catch {
    priceError.value = 'Error al actualizar el precio'
  } finally {
    savingPrice.value = false
  }
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })

const statusLabel = (s: FreightStatus) => ({
  PUBLISHED: 'Nuevo', ASSIGNED: 'Aceptado', IN_COLLECTION: 'En recolección',
  IN_TRANSIT: 'En tránsito', DELIVERED: 'Entregado', CLOSED: 'Cerrado', CANCELLED: 'Cancelado',
}[s] ?? s)

const statusClass = (s: FreightStatus) => ({
  PUBLISHED:     'bg-yellow-100 text-yellow-800',
  ASSIGNED:      'bg-blue-100 text-blue-700',
  IN_COLLECTION: 'bg-orange-100 text-orange-700',
  IN_TRANSIT:    'bg-green-100 text-green-700',
  DELIVERED:     'bg-green-200 text-green-900',
  CLOSED:        'bg-gray-100 text-gray-600',
  CANCELLED:     'bg-red-100 text-red-600',
}[s] ?? 'bg-gray-100 text-gray-600')
</script>
