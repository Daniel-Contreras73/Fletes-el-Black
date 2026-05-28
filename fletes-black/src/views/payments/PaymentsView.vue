<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold tracking-widest" style="color: #DC2626">MIS PAGOS</h1>
      <RouterLink to="/shipments/new"
        class="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        style="background-color: #991B1B">
        <span class="text-lg font-bold">+</span> Nuevo Flete
      </RouterLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-red-100 border-t-red-500 rounded-full animate-spin"></div>
    </div>

    <!-- Sin pagos -->
    <div v-else-if="payments.length === 0"
      class="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center text-gray-400">
      <p class="text-lg mb-1">Sin pagos pendientes</p>
      <p class="text-sm">Tus pagos aparecerán aquí cuando el admin acepte tu flete.</p>
    </div>

    <!-- Lista de pagos -->
    <div v-else class="flex flex-col gap-4">
      <div v-for="p in payments" :key="p.freightId"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

        <!-- Encabezado -->
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="font-mono text-xs text-red-600 font-semibold">{{ p.folio }}</p>
            <p class="font-semibold text-gray-800 mt-0.5">{{ p.originCity }} → {{ p.destinationCity }}</p>
          </div>
          <span :class="statusClass(p.paymentStatus)" class="px-3 py-1 rounded-full text-xs font-semibold">
            {{ statusLabel(p.paymentStatus) }}
          </span>
        </div>

        <!-- Monto -->
        <div class="flex items-center justify-between border-t border-gray-50 pt-3">
          <div>
            <p class="text-xs text-gray-400">Monto a pagar</p>
            <p class="text-2xl font-bold" style="color: #DC2626">${{ p.amount.toLocaleString('es-MX') }} MXN</p>
          </div>

          <!-- PENDING: mostrar preferencia elegida en la cotización -->
          <div v-if="p.paymentStatus === 'PENDING'" class="text-right">
            <p class="text-xs text-gray-400 mb-1">Forma de pago</p>
            <span class="inline-block bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-semibold">
              {{ p.paymentPreference === 'AL_RECOGER' ? '📦 Al recoger' : p.paymentPreference === 'AL_ENTREGAR' ? '🚛 Al entregar' : '—' }}
            </span>
          </div>

          <!-- PAID -->
          <div v-else-if="p.paymentStatus === 'PAID'"
            class="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl text-sm font-semibold">
            ✓ Pagado
          </div>

          <!-- CANCELLED -->
          <div v-else-if="p.paymentStatus === 'CANCELLED'"
            class="text-gray-400 text-sm">
            Cancelado
          </div>
        </div>

        <!-- Info adicional -->
        <p class="text-xs text-gray-400 mt-3">
          Estado del flete: <span class="font-medium text-gray-600">{{ freightStatusLabel(p.freightStatus) }}</span>
          · Fecha: {{ formatDate(p.createdAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

interface Payment {
  freightId: number
  folio: string
  originCity: string
  destinationCity: string
  amount: number
  freightStatus: string
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED'
  paymentPreference: string | null
  createdAt: string
}

const payments = ref<Payment[]>([])
const loading = ref(true)

const fetchPayments = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/payments/mine')
    payments.value = data
  } finally {
    loading.value = false
  }
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })

const statusLabel = (s: string) => ({ PENDING: 'Pendiente', PAID: 'Pagado', CANCELLED: 'Cancelado' }[s] ?? s)

const statusClass = (s: string) => ({
  PENDING:   'bg-yellow-100 text-yellow-800',
  PAID:      'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-500',
}[s] ?? 'bg-gray-100 text-gray-500')

const freightStatusLabel = (s: string) => ({
  ASSIGNED: 'Aceptado', IN_COLLECTION: 'En recolección',
  IN_TRANSIT: 'En tránsito', DELIVERED: 'Entregado', CLOSED: 'Cerrado', CANCELLED: 'Cancelado',
}[s] ?? s)

onMounted(fetchPayments)
</script>
