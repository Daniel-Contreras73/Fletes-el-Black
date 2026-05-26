<template>
  <div>
    <!-- Cabecera -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold tracking-widest" style="color: #E85454">HOME</h1>
      <RouterLink
        to="/shipments/new"
        class="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        style="background-color: #8B1A1A"
      >
        <span class="text-lg font-bold">+</span> Nuevo Flete
      </RouterLink>
    </div>

    <!-- Tarjetas de estadísticas — StatCard recibe props -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard title="Total fletes" :value="store.total" color="red" subtitle="registrados" />
      <StatCard title="Activos" :value="store.active" color="blue" subtitle="en progreso" />
      <StatCard title="Entregados" :value="store.delivered" color="green" subtitle="completados" />
      <StatCard title="Cancelados" :value="store.cancelled" color="gray" subtitle="cancelados" />
    </div>

    <!-- Saludo personalizado con computed -->
    <div class="mb-4 flex items-center justify-between">
      <h2 class="font-semibold text-gray-700">
        Bienvenido, <span style="color: #E85454">{{ greeting }}</span>
      </h2>
      <span class="text-xs text-gray-400">{{ today }}</span>
    </div>

    <!-- Fletes recientes -->
    <div v-if="store.loading" class="flex items-center justify-center py-16 text-gray-400">
      Cargando...
    </div>

    <div v-else-if="store.recent.length === 0" class="bg-white rounded-xl p-10 text-center text-gray-400">
      No tienes fletes aún.
      <RouterLink to="/shipments/new" class="ml-1 font-medium" style="color: #E85454">
        Crea el primero
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ShipmentCard
        v-for="shipment in store.recent"
        :key="shipment.id"
        :shipment="shipment"
        @select="(s) => router.push(`/shipments/${s.id}`)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useShipmentsStore } from '@/stores/shipments'
import ShipmentCard from '@/components/ShipmentCard.vue'
import StatCard from '@/components/StatCard.vue'

const auth = useAuthStore()
const store = useShipmentsStore()
const router = useRouter()

// Hook — carga los fletes al montar la vista
onMounted(() => store.fetchMine())

// Computed — nombre del usuario para el saludo
const greeting = computed(() => auth.user?.firstName ?? 'usuario')

// Computed — fecha de hoy formateada
const today = computed(() =>
  new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
)
</script>
