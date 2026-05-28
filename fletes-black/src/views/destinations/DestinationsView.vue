<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold tracking-widest" style="color: #DC2626">MIS DESTINOS</h1>
      <button @click="showForm = true"
        class="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
        style="background-color: #DC2626">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Agregar destino
      </button>
    </div>

    <!-- Lista de destinos -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-red-100 border-t-red-500 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="destinations.length === 0" class="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
      <svg class="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
      <p class="text-gray-400 font-medium">No tienes destinos guardados</p>
      <p class="text-gray-300 text-sm mt-1">Guarda tus direcciones frecuentes para no escribirlas cada vez</p>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div v-for="dest in destinations" :key="dest.id"
        class="bg-white rounded-2xl p-5 shadow-sm border flex items-center gap-4 transition-all"
        :class="dest.isDefault ? 'border-red-300' : 'border-gray-100'">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          :style="dest.isDefault ? 'background-color: #FEE2E2' : 'background-color: #F3F4F6'">
          <svg class="w-5 h-5" :style="dest.isDefault ? 'color: #DC2626' : 'color: #9CA3AF'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <p class="font-bold text-gray-800">{{ dest.alias }}</p>
            <span v-if="dest.isDefault"
              class="text-xs px-2 py-0.5 rounded-full font-medium"
              style="background-color: #FEE2E2; color: #DC2626">Principal</span>
          </div>
          <p class="text-sm text-gray-500 truncate">{{ dest.street }}</p>
          <p class="text-xs text-gray-400">{{ dest.city }}</p>
          <p v-if="dest.lat" class="text-xs text-gray-300 mt-0.5">
            📍 {{ Number(dest.lat).toFixed(5) }}, {{ Number(dest.lng).toFixed(5) }}
          </p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button v-if="!dest.isDefault" @click="setDefault(dest.id)"
            class="text-xs text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
            Predeterminar
          </button>
          <button @click="confirmDelete(dest.id)"
            class="text-xs text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: agregar destino -->
    <div v-if="showForm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-7 w-full max-w-md shadow-xl">
        <h2 class="text-lg font-bold text-gray-800 mb-5">Nuevo destino guardado</h2>

        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-red-500 text-sm font-medium mb-1">Alias (nombre del lugar)</label>
            <input v-model="form.alias" type="text" placeholder="Ej. Casa, Trabajo, Bodega" :class="inputClass" />
          </div>
          <div>
            <label class="block text-red-500 text-sm font-medium mb-1">Buscar dirección</label>
            <AddressAutocomplete
              v-model="form.street"
              placeholder="Escribe una dirección en Chetumal o México..."
              :inputClass="inputClass"
              @select="onAddressSelect"
            />
            <p class="text-xs text-gray-400 mt-1">Las coordenadas se guardan automáticamente al seleccionar</p>
          </div>
          <div>
            <label class="block text-red-500 text-sm font-medium mb-1">Ciudad</label>
            <input v-model="form.city" type="text" placeholder="Chetumal" :class="inputClass" />
          </div>
          <div v-if="form.lat" class="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
            ✓ Coordenadas guardadas: {{ form.lat.toFixed(5) }}, {{ form.lng.toFixed(5) }}
          </div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.isDefault" type="checkbox" class="accent-red-500 w-4 h-4" />
            <span class="text-sm text-gray-600">Establecer como dirección principal</span>
          </label>
        </div>

        <p v-if="formError" class="text-red-500 text-sm mt-3">{{ formError }}</p>

        <div class="flex gap-3 mt-6">
          <button @click="closeForm"
            class="flex-1 border-2 border-red-300 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors">
            Cancelar
          </button>
          <button @click="save" :disabled="saving"
            class="flex-1 text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
            style="background-color: #DC2626">
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AddressAutocomplete from '@/components/AddressAutocomplete.vue'
import api from '@/services/api'

interface Destination {
  id: number
  alias: string
  street: string
  city: string
  country: string
  lat: number | null
  lng: number | null
  isDefault: boolean
}

const destinations = ref<Destination[]>([])
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const formError = ref('')

const form = ref({
  alias: '',
  street: '',
  city: '',
  lat: null as number | null,
  lng: null as number | null,
  isDefault: false,
})

const inputClass = 'w-full border border-red-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 placeholder-red-200'

const fetchDestinations = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/destinations')
    destinations.value = data
  } finally {
    loading.value = false
  }
}

const onAddressSelect = (addr: { street: string; city: string; lat: number; lng: number }) => {
  form.value.street = addr.street
  form.value.city = addr.city || form.value.city
  form.value.lat = addr.lat
  form.value.lng = addr.lng
}

const save = async () => {
  formError.value = ''
  if (!form.value.alias.trim()) { formError.value = 'Escribe un alias'; return }
  if (!form.value.street.trim()) { formError.value = 'Escribe una dirección'; return }
  if (!form.value.city.trim()) { formError.value = 'Escribe la ciudad'; return }
  saving.value = true
  try {
    await api.post('/destinations', form.value)
    await fetchDestinations()
    closeForm()
  } catch {
    formError.value = 'Error al guardar el destino'
  } finally {
    saving.value = false
  }
}

const setDefault = async (id: number) => {
  await api.patch(`/destinations/${id}/default`)
  await fetchDestinations()
}

const confirmDelete = async (id: number) => {
  if (!confirm('¿Eliminar este destino?')) return
  await api.delete(`/destinations/${id}`)
  destinations.value = destinations.value.filter(d => d.id !== id)
}

const closeForm = () => {
  showForm.value = false
  form.value = { alias: '', street: '', city: '', lat: null, lng: null, isDefault: false }
  formError.value = ''
}

onMounted(fetchDestinations)
</script>
