<template>
  <div class="relative">
    <input
      v-model="query"
      type="text"
      :placeholder="placeholder"
      :class="inputClass"
      @input="onInput"
      @blur="onBlur"
      @keydown.down.prevent="highlight = Math.min(highlight + 1, suggestions.length - 1)"
      @keydown.up.prevent="highlight = Math.max(highlight - 1, 0)"
      @keydown.enter.prevent="selectIndex(highlight)"
      @keydown.escape="suggestions = []"
      autocomplete="off"
    />
    <!-- Spinner -->
    <div v-if="loading" class="absolute right-3 top-1/2 -translate-y-1/2">
      <div class="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
    </div>
    <!-- Dropdown -->
    <ul v-if="suggestions.length"
      class="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden max-h-64 overflow-y-auto">
      <li
        v-for="(s, i) in suggestions" :key="i"
        @mousedown.prevent="selectIndex(i)"
        :class="[
          'px-4 py-3 cursor-pointer text-sm border-b border-gray-50 last:border-0',
          highlight === i ? 'bg-red-50 text-red-700' : 'hover:bg-gray-50 text-gray-700'
        ]"
      >
        <p class="font-medium">{{ s.display_name.split(',')[0] }}</p>
        <p class="text-xs text-gray-400 truncate">{{ s.display_name }}</p>
      </li>
    </ul>
    <!-- Sin resultados -->
    <div v-if="noResults" class="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 px-4 py-3 text-sm text-gray-400">
      No se encontraron resultados
    </div>
  </div>
</template>

<script setup lang="ts">
// Input de dirección con autocompletado — busca direcciones en tiempo real usando la API de Nominatim (OpenStreetMap).
// Muestra un dropdown con sugerencias y emite la dirección seleccionada con coordenadas (lat/lng).
import { ref } from 'vue'

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
  address: {
    road?: string
    suburb?: string
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
  }
}

interface AddressResult {
  displayName: string
  street: string
  city: string
  lat: number
  lng: number
}

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  inputClass?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'select': [address: AddressResult]
}>()

const query = ref(props.modelValue ?? '')
const suggestions = ref<NominatimResult[]>([])
const loading = ref(false)
const noResults = ref(false)
const highlight = ref(0)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const onInput = () => {
  noResults.value = false
  emit('update:modelValue', query.value)
  if (debounceTimer) clearTimeout(debounceTimer)
  if (query.value.length < 3) { suggestions.value = []; return }
  debounceTimer = setTimeout(search, 400)
}

const search = async () => {
  loading.value = true
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.value)}&format=json&addressdetails=1&limit=6&countrycodes=mx,bz&accept-language=es`
    const res = await fetch(url, { headers: { 'Accept-Language': 'es' } })
    const data: NominatimResult[] = await res.json()
    suggestions.value = data
    noResults.value = data.length === 0 && query.value.length >= 3
    highlight.value = 0
  } catch {
    suggestions.value = []
  } finally {
    loading.value = false
  }
}

const selectIndex = (i: number) => {
  const s = suggestions.value[i]
  if (!s) return
  const city = s.address.city ?? s.address.town ?? s.address.village ?? s.address.state ?? ''
  const street = s.address.road
    ? `${s.address.road}${s.address.suburb ? ', ' + s.address.suburb : ''}`
    : s.display_name.split(',')[0]
  query.value = street || s.display_name.split(',')[0]
  emit('update:modelValue', query.value)
  emit('select', {
    displayName: s.display_name,
    street,
    city,
    lat: parseFloat(s.lat),
    lng: parseFloat(s.lon),
  })
  suggestions.value = []
}

const onBlur = () => {
  setTimeout(() => { suggestions.value = []; noResults.value = false }, 200)
}
</script>
