<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-sm flex flex-col">
      <div class="p-6 border-b">
        <h1 class="text-xl font-bold text-gray-900">
          Flete<span class="text-orange-500">Black</span>
        </h1>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <RouterLink
          to="/"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          active-class="bg-orange-50 text-orange-600 font-medium"
        >
           Dashboard
        </RouterLink>

        <RouterLink
          to="/shipments"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          active-class="bg-orange-50 text-orange-600 font-medium"
        >
           Mis Fletes
        </RouterLink>

        <RouterLink
          to="/shipments/new"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          active-class="bg-orange-50 text-orange-600 font-medium"
        >
          ➕ Nuevo Flete
        </RouterLink>

        <RouterLink
          to="/profile"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          active-class="bg-orange-50 text-orange-600 font-medium"
        >
          👤 Mi Perfil
        </RouterLink>

        <RouterLink
          v-if="auth.isAdmin"
          to="/admin/users"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          active-class="bg-orange-50 text-orange-600 font-medium"
        >
          ⚙️ Usuarios
        </RouterLink>
      </nav>

      <!-- Usuario -->
      <div class="p-4 border-t">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {{ initials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ auth.user?.firstName }} {{ auth.user?.lastName }}
            </p>
            <p class="text-xs text-gray-500 truncate">{{ auth.user?.email }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Contenido -->
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const initials = computed(() => {
  const first = auth.user?.firstName?.[0] || ''
  const last = auth.user?.lastName?.[0] || ''
  return (first + last).toUpperCase()
})

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>
