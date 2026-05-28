<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold tracking-widest" style="color: #DC2626">MIS DOCUMENTOS</h1>
      <RouterLink to="/shipments/new"
        class="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        style="background-color: #991B1B">
        <span class="text-lg font-bold">+</span> Nuevo Flete
      </RouterLink>
    </div>

    <!-- Filtros -->
    <div class="flex gap-3 mb-5 flex-wrap">
      <input v-model="search" type="text"
        placeholder="Buscar por nombre de documento o folio"
        class="flex-1 min-w-48 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
      <select v-model="typeFilter"
        class="w-44 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 bg-white">
        <option value="">Todos los tipos</option>
        <option value="FACTURA">Factura</option>
        <option value="CARTA_PORTE">Carta Porte</option>
        <option value="SEGURO">Póliza de Seguro</option>
        <option value="COMPROBANTE">Comprobante</option>
      </select>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <p class="px-5 py-3 text-xs font-bold text-gray-500 tracking-wider border-b border-gray-100">
        LISTADO DE DOCUMENTOS
      </p>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <div class="w-8 h-8 border-4 border-red-100 border-t-red-500 rounded-full animate-spin"></div>
      </div>

      <table v-else class="w-full text-sm">
        <thead style="background-color: #DC2626">
          <tr>
            <th class="text-left px-5 py-3 font-medium text-white">Tipo</th>
            <th class="text-left px-5 py-3 font-medium text-white">Documento</th>
            <th class="text-left px-5 py-3 font-medium text-white">Folio</th>
            <th class="text-left px-5 py-3 font-medium text-white">Fecha</th>
            <th class="text-left px-5 py-3 font-medium text-white">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filtered.length === 0">
            <td colspan="5" class="text-center py-12 text-gray-400">
              {{ search ? 'No hay resultados' : 'No tienes documentos disponibles aún' }}
            </td>
          </tr>
          <tr v-for="(doc, i) in filtered" :key="doc.id"
            class="border-b border-red-50 hover:bg-red-50 transition-colors"
            :style="i % 2 === 0 ? 'background-color: #FFF5F5' : ''">
            <td class="px-5 py-4">
              <span class="flex items-center gap-2 font-medium text-gray-700">
                <span class="text-lg">{{ typeIcon(doc.documentType) }}</span>
                {{ typeLabel(doc.documentType) }}
              </span>
            </td>
            <td class="px-5 py-4 text-gray-800 font-medium">
              {{ typeLabel(doc.documentType) }} {{ doc.folio }}
            </td>
            <td class="px-5 py-4 text-gray-500">{{ doc.folio }}</td>
            <td class="px-5 py-4 text-gray-600">{{ formatDate(doc.createdAt) }}</td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2">
                <a :href="fileUrl(doc.fileUrl)" target="_blank"
                  class="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  ⬇ Descargar
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

interface Document {
  id: number
  documentType: string
  fileUrl: string
  folio: string
  createdAt: string
}

const documents = ref<Document[]>([])
const loading = ref(false)
const search = ref('')
const typeFilter = ref('')

const fetchDocuments = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/documents/mine')
    documents.value = data
  } finally {
    loading.value = false
  }
}

const filtered = computed(() => {
  let list = documents.value
  if (typeFilter.value) list = list.filter(d => d.documentType === typeFilter.value)
  const q = search.value.toLowerCase().trim()
  if (!q) return list
  return list.filter(d =>
    d.documentType.toLowerCase().includes(q) ||
    d.folio.toLowerCase().includes(q)
  )
})

const typeLabel = (t: string) => ({
  FACTURA: 'Factura', CARTA_PORTE: 'Carta Porte',
  SEGURO: 'Póliza de Seguro', COMPROBANTE: 'Comprobante',
}[t] ?? t)

const typeIcon = (t: string) => ({
  FACTURA: '🧾', CARTA_PORTE: '📋', SEGURO: '🛡️', COMPROBANTE: '✅',
}[t] ?? '📄')

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })

const fileUrl = (url: string) => url

onMounted(fetchDocuments)
</script>
