<template>
  <div>
    <!-- Cabecera -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold tracking-widest" style="color: #DC2626">CLUB DE PUNTOS</h1>
      <RouterLink to="/shipments/new"
        class="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
        style="background-color: #991B1B">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        Nuevo Flete
      </RouterLink>
    </div>

    <!-- Tarjeta monedero -->
    <div class="rounded-2xl p-6 mb-6 text-white" style="background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%)">
      <div class="flex items-start justify-between mb-4">
        <div>
          <p class="text-sm opacity-80 mb-1">Monedero de Puntos</p>
          <p class="text-4xl font-bold">{{ points.toLocaleString('es-MX') }}</p>
          <p class="text-sm opacity-80 mt-1">Puntos disponibles</p>
        </div>
        <div class="text-right">
          <span class="inline-flex items-center gap-1.5 bg-white bg-opacity-20 rounded-full px-4 py-1.5 text-sm font-semibold">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 3h14M5 3l-2 5c0 3.314 2.686 6 6 6h2c3.314 0 6-2.686 6-6L19 3M5 3H3m18 0h-2M12 14v7m-4 0h8"/>
            </svg>
            {{ tier }}
          </span>
        </div>
      </div>
      <!-- Barra de progreso hacia siguiente nivel -->
      <div>
        <div class="flex justify-between text-xs opacity-80 mb-1">
          <span>Progreso hacia Socio Oro</span>
          <span>{{ progressPercent }}%</span>
        </div>
        <div class="w-full bg-white bg-opacity-30 rounded-full h-2">
          <div class="bg-white rounded-full h-2 transition-all duration-700"
            :style="`width: ${progressPercent}%`" />
        </div>
        <p class="text-xs opacity-70 mt-1">{{ pointsToNextTier.toLocaleString('es-MX') }} puntos para el siguiente nivel</p>
      </div>
    </div>

    <!-- Catálogo de canje -->
    <h2 class="font-bold text-gray-700 mb-3 tracking-wide text-sm">CATÁLOGO DE CANJE</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div v-for="reward in rewards" :key="reward.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:border-red-200 hover:shadow-md transition-all">

        <!-- Ícono según tipo -->
        <div class="w-11 h-11 rounded-xl flex items-center justify-center"
          :class="reward.iconBg">
          <!-- Descuento en Flete -->
          <svg v-if="reward.id === 1" class="w-5 h-5" :class="reward.iconColor" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z"/>
          </svg>
          <!-- Seguro de Carga -->
          <svg v-else-if="reward.id === 2" class="w-5 h-5" :class="reward.iconColor" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <!-- Prioridad en Ofertas -->
          <svg v-else class="w-5 h-5" :class="reward.iconColor" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>

        <div>
          <p class="font-semibold text-gray-800">{{ reward.name }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ reward.description }}</p>
        </div>
        <div class="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <span class="text-sm font-bold" style="color: #DC2626">
            {{ reward.cost.toLocaleString('es-MX') }} pts
          </span>
          <button
            :disabled="points < reward.cost"
            @click="redeem(reward.id)"
            class="text-xs px-4 py-2 rounded-lg font-semibold transition-colors"
            :class="points >= reward.cost
              ? 'text-white hover:opacity-90'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
            :style="points >= reward.cost ? 'background-color: #DC2626' : ''">
            Canjear
          </button>
        </div>
      </div>
    </div>

    <!-- Historial reciente -->
    <h2 class="font-bold text-gray-700 mb-3 tracking-wide">HISTORIAL RECIENTE</h2>
    <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <table class="w-full text-sm">
        <thead style="background-color: #DC2626">
          <tr>
            <th class="text-left px-5 py-3 font-medium text-white">Fecha</th>
            <th class="text-left px-5 py-3 font-medium text-white">Descripción</th>
            <th class="text-left px-5 py-3 font-medium text-white">Folio</th>
            <th class="text-left px-5 py-3 font-medium text-white">Puntos</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, i) in history" :key="i"
            class="border-b border-red-50 hover:bg-red-50 transition-colors"
            :style="i % 2 === 0 ? 'background-color: #FFF5F5' : ''">
            <td class="px-5 py-3 text-gray-600">{{ formatDate(entry.date) }}</td>
            <td class="px-5 py-3 text-gray-700">{{ entry.description }}</td>
            <td class="px-5 py-3 text-gray-500">{{ entry.folio }}</td>
            <td class="px-5 py-3 font-semibold" :class="entry.points > 0 ? 'text-green-600' : 'text-red-500'">
              {{ entry.points > 0 ? '+' : '' }}{{ entry.points.toLocaleString('es-MX') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const points = ref(0)
const tier = ref('Socio Bronce')
const nextTierThreshold = ref<number | null>(null)
const pointsToNextTier = ref(0)
const progressPercent = ref(0)
const loading = ref(true)

interface Reward {
  id: number
  name: string
  description: string
  cost: number
  iconBg: string
  iconColor: string
}

const rewards = ref<Reward[]>([
  { id: 1, name: 'Descuento en Flete',    description: '10% de descuento en tu próximo flete',              cost: 3000, iconBg: 'bg-red-50',    iconColor: 'text-red-500'    },
  { id: 2, name: 'Seguro de Carga Gratis', description: 'Cobertura básica sin costo extra',                 cost: 5000, iconBg: 'bg-blue-50',   iconColor: 'text-blue-500'   },
  { id: 3, name: 'Prioridad en Ofertas',  description: 'Tus fletes aparecen primero ante transportistas',   cost: 8000, iconBg: 'bg-amber-50',  iconColor: 'text-amber-500'  },
])

interface HistoryEntry {
  date: string
  description: string
  folio: string
  points: number
}

const history = ref<HistoryEntry[]>([])

const fetchLoyalty = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/loyalty')
    points.value = data.points
    tier.value = data.tier
    nextTierThreshold.value = data.nextTierThreshold
    pointsToNextTier.value = data.pointsToNextTier
    progressPercent.value = data.progressPercent
    history.value = data.history
  } finally {
    loading.value = false
  }
}

const redeem = (id: number) => {
  const reward = rewards.value.find(r => r.id === id)
  if (!reward || points.value < reward.cost) return
  points.value -= reward.cost
  history.value.unshift({
    date: new Date().toISOString(),
    description: `Canje: ${reward.name}`,
    folio: '—',
    points: -reward.cost,
  })
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })

onMounted(fetchLoyalty)
</script>
