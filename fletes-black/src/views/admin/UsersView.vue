<template>
  <div class="p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
      <p class="text-sm text-gray-500 mt-1">{{ users.length }} usuarios registrados</p>
    </div>

    <!-- Error -->
    <div v-if="error" class="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20 text-gray-400">
      Cargando usuarios...
    </div>

    <!-- Tabla -->
    <div v-else class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-6 py-4 font-medium text-gray-500">Usuario</th>
            <th class="text-left px-6 py-4 font-medium text-gray-500">Teléfono</th>
            <th class="text-left px-6 py-4 font-medium text-gray-500">Rol</th>
            <th class="text-left px-6 py-4 font-medium text-gray-500">Estado</th>
            <th class="text-left px-6 py-4 font-medium text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-if="users.length === 0">
            <td colspan="5" class="text-center py-12 text-gray-400">No hay usuarios registrados</td>
          </tr>
          <tr
            v-for="user in users"
            :key="user.id"
            class="hover:bg-gray-50 transition-colors"
            :class="{ 'opacity-50': !user.isActive }"
          >
            <!-- Nombre + Email -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                  {{ initials(user) }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</p>
                  <p class="text-gray-400 text-xs">{{ user.email }}</p>
                </div>
              </div>
            </td>

            <!-- Teléfono -->
            <td class="px-6 py-4 text-gray-600">
              {{ user.phone ?? '—' }}
            </td>

            <!-- Rol -->
            <td class="px-6 py-4">
              <span :class="roleBadge(user.role.userType)" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ user.role.userType }}
              </span>
            </td>

            <!-- Estado -->
            <td class="px-6 py-4">
              <span
                :class="user.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ user.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </td>

            <!-- Acciones -->
            <td class="px-6 py-4">
              <div v-if="user.isActive" class="flex items-center gap-2">
                <select
                  :value="user.role.userType"
                  @change="onChangeRole(user.id, ($event.target as HTMLSelectElement).value as UserType)"
                  class="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="CLIENT">CLIENT</option>
                  <option value="TRANSPORTER">TRANSPORTER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>

                <button
                  @click="onDeactivate(user.id)"
                  class="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Desactivar
                </button>
              </div>
              <span v-else class="text-xs text-gray-300">Sin acciones</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/users'
import type { UserType } from '@/services/users.service'

const store = useUsersStore()
const { users, loading, error } = storeToRefs(store)

onMounted(() => store.fetchAll())

const initials = (user: { firstName: string; lastName: string }) =>
  ((user.firstName[0] ?? '') + (user.lastName[0] ?? '')).toUpperCase()

const roleBadge = (role: UserType) => ({
  'bg-orange-100 text-orange-600': role === 'ADMIN',
  'bg-blue-50 text-blue-600': role === 'CLIENT',
  'bg-green-50 text-green-600': role === 'TRANSPORTER'
})

const onChangeRole = async (id: number, role: UserType) => {
  await store.changeRole(id, role)
}

const onDeactivate = async (id: number) => {
  if (!confirm('¿Seguro que quieres desactivar este usuario?')) return
  await store.removeUser(id)
}
</script>
