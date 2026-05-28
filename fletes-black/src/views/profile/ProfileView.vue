<template>
  <div>
    <!-- Cabecera de página -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold tracking-widest" style="color: #DC2626">CONFIGURACIÓN</h1>
      <RouterLink
        to="/shipments/new"
        class="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        style="background-color: #991B1B"
      >
        <span class="text-lg font-bold">+</span>
        Nuevo Flete
      </RouterLink>
    </div>

    <!-- Tarjeta de perfil -->
    <div class="rounded-2xl p-8" style="background-color: #EE7E7E">
      <div class="flex items-start gap-8">
        <!-- Avatar -->
        <div
          class="w-36 h-36 rounded-full flex items-center justify-center flex-shrink-0"
          style="background-color: #991B1B"
        >
          <svg class="w-20 h-20 text-red-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>

        <!-- Campos del formulario -->
        <div class="flex-1 grid grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <label class="block text-gray-700 text-sm mb-1.5">Nombre</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2"
              style="background-color: #F4A0A0; border: 1.5px solid #EE7E7E; focus-ring-color: #991B1B"
              :placeholder="auth.user?.firstName + ' ' + (auth.user?.lastName ?? '')"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm mb-1.5">Teléfono</label>
            <input
              v-model="form.phone"
              type="tel"
              class="w-full rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2"
              style="background-color: #F4A0A0; border: 1.5px solid #EE7E7E"
              placeholder="+52 983 123 4567"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm mb-1.5">E-Mail</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2"
              style="background-color: #F4A0A0; border: 1.5px solid #EE7E7E"
              :placeholder="auth.user?.email ?? ''"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm mb-1.5">Cambiar contraseña</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2"
              style="background-color: #F4A0A0; border: 1.5px solid #EE7E7E"
              :placeholder="auth.user?.email ?? ''"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const form = reactive({
  name: '',
  phone: '',
  email: '',
  password: ''
})
</script>
