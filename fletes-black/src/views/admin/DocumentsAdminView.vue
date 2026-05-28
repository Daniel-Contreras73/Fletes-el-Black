<template>
  <div class="max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold tracking-widest" style="color: #DC2626">DOCUMENTOS — ADMIN</h1>
      <button @click="openUpload"
        class="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
        style="background-color: #DC2626">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Subir documento
      </button>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <p class="px-5 py-3 text-xs font-bold text-gray-500 tracking-wider border-b border-gray-100">
        TODOS LOS DOCUMENTOS
      </p>
      <div v-if="loading" class="flex justify-center py-16">
        <div class="w-8 h-8 border-4 border-red-100 border-t-red-500 rounded-full animate-spin"></div>
      </div>
      <table v-else class="w-full text-sm">
        <thead style="background-color: #DC2626">
          <tr>
            <th class="text-left px-5 py-3 font-medium text-white">Tipo</th>
            <th class="text-left px-5 py-3 font-medium text-white">Folio</th>
            <th class="text-left px-5 py-3 font-medium text-white">Cliente</th>
            <th class="text-left px-5 py-3 font-medium text-white">Fecha</th>
            <th class="text-left px-5 py-3 font-medium text-white">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="documents.length === 0">
            <td colspan="5" class="text-center py-12 text-gray-400">No hay documentos subidos aún</td>
          </tr>
          <tr v-for="(doc, i) in documents" :key="doc.id"
            class="border-b border-red-50 hover:bg-red-50 transition-colors"
            :style="i % 2 === 0 ? 'background-color: #FFF5F5' : ''">
            <td class="px-5 py-4">
              <span class="flex items-center gap-2 font-medium text-gray-700">
                <span>{{ typeIcon(doc.documentType) }}</span>
                {{ typeLabel(doc.documentType) }}
              </span>
            </td>
            <td class="px-5 py-4 text-gray-500 font-mono text-xs">
              {{ doc.freight?.trackingFolio ?? '—' }}
            </td>
            <td class="px-5 py-4 text-gray-700">
              {{ doc.freight?.shipper?.firstName }} {{ doc.freight?.shipper?.lastName }}
              <p class="text-xs text-gray-400">{{ doc.freight?.shipper?.email }}</p>
            </td>
            <td class="px-5 py-4 text-gray-600">{{ formatDate(doc.createdAt) }}</td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2">
                <a :href="fileUrl(doc.fileUrl)" target="_blank"
                  class="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                  Ver
                </a>
                <button @click="deleteDoc(doc.id)"
                  class="text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100">
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal subir documento -->
    <div v-if="showUpload" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-7 w-full max-w-md shadow-xl">
        <h2 class="text-lg font-bold text-gray-800 mb-5">Subir documento</h2>
        <div class="flex flex-col gap-4">
          <!-- Buscador de fletes -->
          <div>
            <label class="block text-red-500 text-sm font-medium mb-1">Flete</label>
            <div class="relative">
              <input
                v-model="freightSearch"
                type="text"
                placeholder="Buscar por folio o nombre del cliente..."
                :class="inputClass"
                @input="filterFreights"
                @focus="showFreightList = true"
                @blur="onFreightBlur"
              />
              <!-- Dropdown de resultados -->
              <div v-if="showFreightList && filteredFreights.length > 0"
                class="absolute top-full left-0 right-0 z-10 bg-white border border-red-200 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                <button
                  v-for="f in filteredFreights" :key="f.id"
                  type="button"
                  @mousedown.prevent="selectFreight(f)"
                  class="w-full text-left px-4 py-2.5 hover:bg-red-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <span class="font-mono text-xs text-red-600 font-semibold">{{ f.trackingFolio }}</span>
                  <span class="mx-2 text-gray-300">|</span>
                  <span class="text-sm text-gray-700">{{ f.shipper?.firstName }} {{ f.shipper?.lastName }}</span>
                  <p class="text-xs text-gray-400 mt-0.5">{{ f.originCity }} → {{ f.destinationCity }}</p>
                </button>
              </div>
              <div v-if="showFreightList && freightSearch && filteredFreights.length === 0 && !loadingFreights"
                class="absolute top-full left-0 right-0 z-10 bg-white border border-red-200 rounded-lg shadow-lg mt-1">
                <p class="px-4 py-3 text-sm text-gray-400">Sin resultados</p>
              </div>
              <div v-if="loadingFreights" class="absolute top-full left-0 right-0 z-10 bg-white border border-red-200 rounded-lg shadow-lg mt-1">
                <p class="px-4 py-3 text-sm text-gray-400">Cargando fletes...</p>
              </div>
            </div>
            <p v-if="freightId" class="text-xs text-green-600 mt-1">
              ✓ {{ freightInfo?.originCity }} → {{ freightInfo?.destinationCity }} · {{ freightInfo?.shipper?.firstName }} {{ freightInfo?.shipper?.lastName }}
            </p>
          </div>
          <div>
            <label class="block text-red-500 text-sm font-medium mb-1">Tipo de documento</label>
            <select v-model="form.documentType" :class="inputClass">
              <option value="">Selecciona un tipo</option>
              <option value="FACTURA">Factura</option>
              <option value="CARTA_PORTE">Carta Porte</option>
              <option value="SEGURO">Póliza de Seguro</option>
              <option value="COMPROBANTE">Comprobante de Entrega</option>
            </select>
          </div>
          <div>
            <label class="block text-red-500 text-sm font-medium mb-1">Archivo (PDF, JPG, PNG)</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="onFileChange"
              class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:text-white file:cursor-pointer"
              :style="'--file-btn-bg: #DC2626'" />
            <p v-if="form.file" class="text-xs text-green-600 mt-1">✓ {{ form.file.name }}</p>
          </div>
        </div>
        <p v-if="uploadError" class="text-red-500 text-sm mt-3">{{ uploadError }}</p>
        <div class="flex gap-3 mt-6">
          <button @click="closeUpload"
            class="flex-1 border-2 border-red-300 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50">
            Cancelar
          </button>
          <button @click="submitUpload" :disabled="uploading"
            class="flex-1 text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-40"
            style="background-color: #DC2626">
            {{ uploading ? 'Subiendo...' : 'Subir' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

interface FreightDoc {
  id: number
  documentType: string
  fileUrl: string
  createdAt: string
  freight?: { trackingFolio: string; originCity: string; destinationCity: string; shipper?: { firstName: string; lastName: string; email: string } }
}

interface FreightOption {
  id: number
  trackingFolio: string
  originCity: string
  destinationCity: string
  shipper?: { firstName: string; lastName: string; email: string }
}

const documents = ref<FreightDoc[]>([])
const loading = ref(false)
const showUpload = ref(false)
const uploading = ref(false)
const uploadError = ref('')
const freightInfo = ref<FreightOption | null>(null)
const freightId = ref<number | null>(null)

// Freight search dropdown
const allFreights = ref<FreightOption[]>([])
const filteredFreights = ref<FreightOption[]>([])
const freightSearch = ref('')
const showFreightList = ref(false)
const loadingFreights = ref(false)

const form = ref({ documentType: '', file: null as File | null })
const inputClass = 'w-full border border-red-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200'

const fetchDocuments = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/documents')
    documents.value = data
  } finally {
    loading.value = false
  }
}

const fetchAllFreights = async () => {
  if (allFreights.value.length > 0) return
  loadingFreights.value = true
  try {
    const { data } = await api.get('/shipments')
    const list = data.shipments ?? data
    allFreights.value = list
    filteredFreights.value = list
  } finally {
    loadingFreights.value = false
  }
}

const filterFreights = () => {
  const q = freightSearch.value.toLowerCase().trim()
  if (!q) {
    filteredFreights.value = allFreights.value
    return
  }
  filteredFreights.value = allFreights.value.filter(f =>
    f.trackingFolio.toLowerCase().includes(q) ||
    `${f.shipper?.firstName} ${f.shipper?.lastName}`.toLowerCase().includes(q) ||
    f.originCity.toLowerCase().includes(q) ||
    f.destinationCity.toLowerCase().includes(q)
  )
}

const selectFreight = (f: FreightOption) => {
  freightId.value = f.id
  freightInfo.value = f
  freightSearch.value = `${f.trackingFolio} — ${f.shipper?.firstName} ${f.shipper?.lastName}`
  showFreightList.value = false
}

const onFreightBlur = () => {
  setTimeout(() => { showFreightList.value = false }, 150)
}

const openUpload = async () => {
  showUpload.value = true
  await fetchAllFreights()
  filteredFreights.value = allFreights.value
}

const onFileChange = (e: Event) => {
  form.value.file = (e.target as HTMLInputElement).files?.[0] ?? null
}

const submitUpload = async () => {
  uploadError.value = ''
  if (!freightId.value) { uploadError.value = 'Selecciona un flete'; return }
  if (!form.value.documentType) { uploadError.value = 'Selecciona el tipo de documento'; return }
  if (!form.value.file) { uploadError.value = 'Selecciona un archivo'; return }

  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('freightId', String(freightId.value))
    fd.append('documentType', form.value.documentType)
    fd.append('file', form.value.file)
    await api.post('/documents', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    await fetchDocuments()
    closeUpload()
  } catch {
    uploadError.value = 'Error al subir el documento'
  } finally {
    uploading.value = false
  }
}

const deleteDoc = async (id: number) => {
  if (!confirm('¿Eliminar este documento?')) return
  await api.delete(`/documents/${id}`)
  documents.value = documents.value.filter(d => d.id !== id)
}

const closeUpload = () => {
  showUpload.value = false
  form.value = { documentType: '', file: null }
  freightInfo.value = null
  freightId.value = null
  freightSearch.value = ''
  showFreightList.value = false
  uploadError.value = ''
}

const typeLabel = (t: string) => ({ FACTURA: 'Factura', CARTA_PORTE: 'Carta Porte', SEGURO: 'Póliza de Seguro', COMPROBANTE: 'Comprobante' }[t] ?? t)
const typeIcon = (t: string) => ({ FACTURA: '🧾', CARTA_PORTE: '📋', SEGURO: '🛡️', COMPROBANTE: '✅' }[t] ?? '📄')
const formatDate = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
const fileUrl = (url: string) => url

onMounted(fetchDocuments)
</script>
