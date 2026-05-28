<template>
  <div>

    <!-- ══════════════════════════════════════════════════════
         PANEL ADMIN
    ══════════════════════════════════════════════════════ -->
    <template v-if="auth.isAdmin">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold tracking-widest" style="color: #DC2626">PANEL DE ADMINISTRACIÓN</h1>
        <span class="text-xs text-gray-400">{{ today }}</span>
      </div>

      <!-- Stats de usuarios -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total usuarios" :value="usersStore.users.length" color="red" subtitle="registrados" />
        <StatCard title="Clientes" :value="countClients" color="blue" subtitle="activos" />
        <StatCard title="Transportistas" :value="countTransporters" color="green" subtitle="registrados" />
        <StatCard title="Inactivos" :value="countInactive" color="gray" subtitle="desactivados" />
      </div>

      <!-- Búsqueda -->
      <div class="flex gap-3 mb-5">
        <input v-model="adminSearch" type="text"
          placeholder="Buscar por nombre o correo..."
          class="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
        <select v-model="adminRoleFilter"
          class="w-44 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 bg-white">
          <option value="">Todos los roles</option>
          <option value="CLIENT">Cliente</option>
          <option value="TRANSPORTER">Transportista</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <!-- Tabla de usuarios -->
      <div v-if="usersStore.loading" class="flex items-center justify-center py-16 text-gray-400">
        Cargando usuarios...
      </div>
      <div v-else class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <p class="px-5 py-3 text-xs font-bold text-gray-500 tracking-wider border-b border-gray-100">
          LISTADO DE USUARIOS
        </p>
        <table class="w-full text-sm">
          <thead style="background-color: #DC2626">
            <tr>
              <th class="text-left px-5 py-3 font-medium text-white">Usuario</th>
              <th class="text-left px-5 py-3 font-medium text-white">Teléfono</th>
              <th class="text-left px-5 py-3 font-medium text-white">Rol</th>
              <th class="text-left px-5 py-3 font-medium text-white">Estado</th>
              <th class="text-left px-5 py-3 font-medium text-white">Registro</th>
              <th class="text-left px-5 py-3 font-medium text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-400">No hay usuarios</td>
            </tr>
            <tr v-for="(u, i) in filteredUsers" :key="u.id"
              class="border-b border-red-50 hover:bg-red-50 transition-colors"
              :style="i % 2 === 0 ? 'background-color: #FFF5F5' : ''"
              :class="{ 'opacity-50': !u.isActive }">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                    style="background-color: #DC2626">
                    {{ initials(u) }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">{{ u.firstName }} {{ u.lastName }}</p>
                    <p class="text-xs text-gray-400">{{ u.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 text-gray-600">{{ u.phone ?? '—' }}</td>
              <td class="px-5 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="roleBadge(u.role.userType)">
                  {{ roleLabel(u.role.userType) }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'">
                  {{ u.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-5 py-4 text-gray-500 text-xs">{{ formatDate(u.createdAt) }}</td>
              <td class="px-5 py-4">
                <div v-if="u.isActive" class="flex items-center gap-2">
                  <select :value="u.role.userType"
                    @change="onRoleChange(u.id, $event)"
                    class="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
                    <option value="CLIENT">Cliente</option>
                    <option value="TRANSPORTER">Transportista</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button @click="usersStore.removeUser(u.id)"
                    class="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                    Desactivar
                  </button>
                </div>
                <span v-else class="text-xs text-gray-300">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ══════════════════════════════════════════════════════
         PANEL CLIENTE
    ══════════════════════════════════════════════════════ -->
    <template v-else>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold tracking-widest" style="color: #DC2626">HOME</h1>
        <RouterLink to="/shipments/new"
          class="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
          style="background-color: #991B1B">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Flete
        </RouterLink>
      </div>

      <div class="mb-5 flex items-center justify-between">
        <h2 class="font-semibold text-gray-700">
          Bienvenido, <span style="color: #DC2626">{{ greeting }}</span>
        </h2>
        <span class="text-xs text-gray-400">{{ today }}</span>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total fletes" :value="shipmentsStore.total" color="red" subtitle="registrados" />
        <StatCard title="Activos" :value="shipmentsStore.active" color="blue" subtitle="en progreso" />
        <StatCard title="Entregados" :value="shipmentsStore.delivered" color="green" subtitle="completados" />
        <StatCard title="Cancelados" :value="shipmentsStore.cancelled" color="gray" subtitle="cancelados" />
      </div>

      <!-- Acciones rápidas -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <RouterLink to="/payments"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-2.5 hover:border-red-200 hover:shadow-md transition-all group">
          <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor"/>
              <path stroke-linecap="round" d="M2 10h20"/>
              <path stroke-linecap="round" stroke-width="2" d="M6 15h4"/>
            </svg>
          </div>
          <span class="text-xs font-semibold text-gray-600">Mis Pagos</span>
        </RouterLink>

        <RouterLink to="/loyalty"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-2.5 hover:border-red-200 hover:shadow-md transition-all group">
          <div class="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <span class="text-xs font-semibold text-gray-600">Recompensas</span>
        </RouterLink>

        <a href="https://wa.me/529831015526?text=Hola%2C%20necesito%20ayuda%20con%20mi%20flete."
          target="_blank" rel="noopener noreferrer"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-2.5 hover:border-green-300 hover:shadow-md transition-all group">
          <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <span class="text-xs font-semibold text-gray-600">WhatsApp</span>
        </a>

        <RouterLink to="/shipments"
          class="rounded-xl p-5 flex flex-col items-center gap-2 hover:opacity-90 transition-opacity"
          style="background-color: #DC2626">
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2.5.5M13 16l1.5.5M13 16H9m4 0h2m0 0l2-5h-4V8h4l2 5-2 2z"/>
            </svg>
          </div>
          <span class="text-xs font-semibold text-white">Fletes Activos</span>
          <span class="text-2xl font-bold text-white leading-none">{{ shipmentsStore.active }}</span>
        </RouterLink>
      </div>

      <!-- Fletes recientes -->
      <div v-if="shipmentsStore.loading" class="flex items-center justify-center py-16 text-gray-400">
        Cargando...
      </div>

      <template v-else>
        <div v-if="shipmentsStore.recent.length === 0" class="bg-white rounded-xl p-10 text-center text-gray-400 mb-6">
          No tienes fletes aún.
          <RouterLink to="/shipments/new" class="ml-1 font-medium" style="color: #DC2626">
            Crea el primero
          </RouterLink>
        </div>

        <div v-else class="mb-8">
          <h3 class="font-bold text-gray-700 mb-3 tracking-wide text-sm">FLETES RECIENTES</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ShipmentCard
              v-for="shipment in shipmentsStore.recent"
              :key="shipment.id"
              :shipment="shipment"
              @select="(s) => router.push(`/shipments/${s.id}`)"
            />
          </div>
        </div>

      </template>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useShipmentsStore } from '@/stores/shipments'
import { useUsersStore } from '@/stores/users'
import ShipmentCard from '@/components/ShipmentCard.vue'
import StatCard from '@/components/StatCard.vue'

const auth = useAuthStore()
const shipmentsStore = useShipmentsStore()
const usersStore = useUsersStore()
const router = useRouter()

const adminSearch = ref('')
const adminRoleFilter = ref('')

onMounted(() => {
  if (auth.isAdmin) {
    usersStore.fetchAll()
  } else {
    shipmentsStore.fetchMine()
  }
})

// ── Admin computed ──────────────────────────────────────────
const countClients = computed(() =>
  usersStore.users.filter(u => u.role.userType === 'CLIENT' && u.isActive).length
)
const countTransporters = computed(() =>
  usersStore.users.filter(u => u.role.userType === 'TRANSPORTER' && u.isActive).length
)
const countInactive = computed(() =>
  usersStore.users.filter(u => !u.isActive).length
)

const filteredUsers = computed(() => {
  let list = usersStore.users
  if (adminRoleFilter.value) list = list.filter(u => u.role.userType === adminRoleFilter.value)
  const q = adminSearch.value.toLowerCase().trim()
  if (!q) return list
  return list.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  )
})

const initials = (u: { firstName: string; lastName: string }) =>
  ((u.firstName[0] ?? '') + (u.lastName[0] ?? '')).toUpperCase()

const onRoleChange = (id: number, event: Event) => {
  const val = (event.target as HTMLSelectElement).value
  usersStore.changeRole(id, val as 'ADMIN' | 'CLIENT' | 'TRANSPORTER')
}

const roleBadge = (r: string) => ({
  ADMIN: 'bg-red-100 text-red-700',
  CLIENT: 'bg-blue-100 text-blue-700',
  TRANSPORTER: 'bg-green-100 text-green-700',
}[r] ?? 'bg-gray-100 text-gray-600')

const roleLabel = (r: string) => ({ ADMIN: 'Admin', CLIENT: 'Cliente', TRANSPORTER: 'Transportista' }[r] ?? r)

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })

// ── Cliente computed ────────────────────────────────────────
const greeting = computed(() => auth.user?.firstName ?? 'usuario')

const today = computed(() =>
  new Date().toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
)
</script>
