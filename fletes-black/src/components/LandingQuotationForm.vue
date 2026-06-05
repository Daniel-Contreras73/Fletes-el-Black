<template>
  <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
    <StepIndicator :total="6" :current="step" class="mb-8" />

    <p class="text-center text-red-500 font-semibold text-base mb-8 px-4">{{ stepTitle }}</p>

    <!-- PASO 1: Ubicaciones y contacto -->
    <div v-if="step === 1">
      <div class="grid grid-cols-2 gap-5">
        <div>
          <label class="block text-red-500 text-sm font-medium mb-1">Origen (Punto A)</label>
          <input v-model="form.origin" type="text" placeholder="Ej. Calle Gardenias con Héroes" :class="inputClass" />
        </div>
        <div>
          <label class="block text-red-500 text-sm font-medium mb-1">Destino (Punto B)</label>
          <input v-model="form.destination" type="text" placeholder="Ej. Av. Insurgentes 212" :class="inputClass" />
        </div>
        <div>
          <label class="block text-red-500 text-sm font-medium mb-1">Su nombre</label>
          <input v-model="form.contactName" type="text" placeholder="Nombre completo" :class="inputClass" />
        </div>
        <div>
          <label class="block text-red-500 text-sm font-medium mb-1">Teléfono / WhatsApp</label>
          <input v-model="form.contactPhone" type="tel" placeholder="983 101 XXXX" :class="inputClass" />
        </div>
        <div>
          <label class="block text-red-500 text-sm font-medium mb-1">Número interior (opcional)</label>
          <input v-model="form.floorNumber" type="text" placeholder="#113" :class="inputClass" />
        </div>
        <div>
          <label class="block text-red-500 text-sm font-medium mb-1">Tipo de servicio</label>
          <select v-model="form.destinationType" :class="inputClass">
            <option value="local">Local — Chetumal y zona metropolitana</option>
            <option value="foraneo">Foráneo — Resto de México</option>
            <option value="belice">Internacional — Belice</option>
          </select>
        </div>
        <div class="col-span-2">
          <label class="block text-red-500 text-sm font-medium mb-1">Referencias del domicilio de origen</label>
          <input v-model="form.references" type="text" placeholder="Ej. Maderería 'Gallardo', edificio de dos pisos color naranja" :class="inputClass" />
        </div>
      </div>
    </div>

    <!-- PASO 2: Imágenes -->
    <div v-else-if="step === 2">
      <div class="grid grid-cols-3 gap-5">
        <div class="flex flex-col gap-3">
          <div v-for="tip in uploadTips" :key="tip.text"
            class="bg-red-500 rounded-xl p-3 flex items-start gap-2 text-white text-xs">
            <span class="text-base mt-0.5 flex-shrink-0">{{ tip.icon }}</span>
            <span>{{ tip.text }}</span>
          </div>
          <div class="rounded-xl p-3 bg-red-50 border border-red-200 text-xs text-red-700">
            💡 Se analizará las fotos para identificar los objetos y calcular el precio automáticamente.
          </div>
        </div>
        <div @click="triggerFileInput" @dragover.prevent @drop.prevent="onDrop"
          class="border-2 border-red-300 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-red-50 transition-colors">
          <svg class="w-14 h-14 text-red-400 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p class="text-red-500 font-semibold text-sm text-center">Subir imagen<br>o arrastra aquí</p>
          <p class="text-gray-400 text-xs mt-1">Máximo 5 fotos</p>
          <input ref="fileInputRef" type="file" multiple accept="image/*" class="hidden" @change="onFilesSelected" />
        </div>
        <div class="grid grid-cols-2 gap-2 content-start">
          <div v-for="(url, i) in previewUrls" :key="i" class="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img :src="url" class="w-full h-full object-cover" :alt="`imagen ${i+1}`" />
            <button @click.stop="removeImage(i)"
              class="absolute top-1 right-1 w-6 h-6 bg-gray-800/70 text-white rounded-full text-sm hover:bg-gray-900 flex items-center justify-center leading-none">
              ×
            </button>
          </div>
          <div v-for="n in emptySlots" :key="'empty-'+n"
            class="aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- PASO 3: Protección -->
    <div v-else-if="step === 3">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="mat in protectionMaterials" :key="mat.id"
          @click="toggleProtection(mat.id)"
          :class="form.protection.includes(mat.id) ? 'ring-4 ring-red-500 ring-offset-2' : ''"
          class="cursor-pointer rounded-xl overflow-hidden relative transition-all">
          <div class="h-32 flex items-center justify-center text-5xl" :style="`background-color: ${mat.bg}`">
            {{ mat.icon }}
          </div>
          <div class="absolute inset-0 bg-black/35 flex items-end p-3">
            <span class="text-white font-semibold text-sm">{{ mat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PASO 4: Dificultad -->
    <div v-else-if="step === 4">
      <div class="grid grid-cols-2 gap-4">
        <div v-for="diff in difficultyOptions" :key="diff.id"
          @click="toggleDifficulty(diff.id)"
          :class="form.difficulties.includes(diff.id) ? 'bg-red-100 border-red-400' : 'bg-pink-50 border-pink-200 hover:border-red-300'"
          class="border-2 rounded-xl p-5 cursor-pointer transition-colors">
          <p class="font-bold text-red-700 mb-1">{{ diff.label }}</p>
          <p class="text-red-400 text-sm">{{ diff.description }}</p>
        </div>
      </div>
    </div>

    <!-- PASO 5: Análisis IA -->
    <div v-else-if="step === 5">
      <!-- Analizando -->
      <div v-if="analyzing" class="flex flex-col items-center justify-center py-16">
        <div class="w-12 h-12 rounded-full border-4 border-red-100 border-t-red-500 animate-spin mb-6"></div>
        <p class="text-red-500 font-semibold text-lg mb-2">Analizando tu carga con IA...</p>
        <p class="text-gray-400 text-sm">{{ analyzingMsg }}</p>
      </div>
      <!-- Generando cotización -->
      <div v-else-if="quoting" class="flex flex-col items-center justify-center py-16">
        <div class="w-12 h-12 rounded-full border-4 border-red-100 border-t-red-500 animate-spin mb-6"></div>
        <p class="text-red-500 font-semibold text-lg mb-2">Calculando precio...</p>
        <p class="text-gray-400 text-sm">Aplicando tarifas y tipo de servicio</p>
      </div>
      <!-- Error -->
      <div v-else-if="analyzeError" class="text-center py-10">
        <p class="text-red-500 font-semibold mb-4">{{ analyzeError }}</p>
        <button @click="retryAnalysis" class="text-sm text-red-400 hover:text-red-600 underline">
          Reintentar análisis
        </button>
      </div>
      <!-- Resultados -->
      <div v-else>
        <div v-if="aiMessage" class="rounded-xl p-4 mb-5 bg-red-50 border border-red-100 text-sm text-red-700 italic">
          {{ aiMessage }}
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="(obj, i) in analyzedItems" :key="i"
            class="rounded-xl p-4 flex items-center gap-4"
            style="background-color: #FDDCDC">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
              {{ obj.emoji }}
            </div>
            <div class="flex-1">
              <p class="font-bold text-gray-800">{{ obj.nombre }}</p>
              <p class="text-sm text-gray-500">
                {{ obj.largo_cm ? `${obj.largo_cm}×${obj.ancho_cm}×${obj.alto_cm} cm · ${obj.peso_kg} kg` : 'Dimensiones estimadas por IA' }}
              </p>
              <div class="flex gap-2 mt-1 flex-wrap">
                <span class="bg-red-200 text-red-700 text-xs px-2 py-0.5 rounded-full capitalize">{{ obj.tamano_categoria }}</span>
                <span class="bg-red-200 text-red-700 text-xs px-2 py-0.5 rounded-full">
                  {{ obj.dificultad === 'normal' ? '✓ Fácil' : obj.dificultad === 'moderada' ? '⚠ Moderado' : '🔴 Difícil' }}
                </span>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-xl font-bold text-gray-800">{{ obj.peso_kg ?? '?' }} kg</p>
              <p class="text-xs text-gray-400">{{ obj.confianza }}% confianza</p>
            </div>
          </div>
        </div>
        <!-- Necesita datos manuales -->
        <div v-for="(obj, i) in itemsNeedingInfo" :key="'manual-'+i"
          class="mt-4 rounded-xl p-5 border border-red-200 bg-red-50">
          <p class="font-bold text-red-700 mb-1">{{ obj.emoji }} {{ obj.nombre }} — Se necesitan datos</p>
          <p class="text-sm text-gray-600 mb-3">{{ obj.razon_manual }}</p>
          <div class="grid grid-cols-4 gap-3">
            <div>
              <label class="block text-red-500 text-xs font-medium mb-1">Largo (cm)</label>
              <input v-model="manualDims[i].largo" type="number" placeholder="180" :class="inputClass" />
            </div>
            <div>
              <label class="block text-red-500 text-xs font-medium mb-1">Ancho (cm)</label>
              <input v-model="manualDims[i].ancho" type="number" placeholder="60" :class="inputClass" />
            </div>
            <div>
              <label class="block text-red-500 text-xs font-medium mb-1">Alto (cm)</label>
              <input v-model="manualDims[i].alto" type="number" placeholder="90" :class="inputClass" />
            </div>
            <div>
              <label class="block text-red-500 text-xs font-medium mb-1">Peso (kg)</label>
              <input v-model="manualDims[i].peso" type="number" placeholder="75" :class="inputClass" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PASO 6: Cotización lista -->
    <div v-else-if="step === 6">
      <div class="py-4">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style="background-color: #FEE2E2">
            <svg class="w-6 h-6" style="color: #DC2626" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">Tu cotización está lista</h3>
            <p class="text-gray-500 text-sm">{{ form.origin }} → {{ form.destination }}</p>
          </div>
        </div>

        <!-- Desglose por objeto -->
        <div v-if="quoteResult?.desglose" class="flex flex-col gap-2 mb-5">
          <div v-for="item in quoteResult.desglose" :key="item.nombre"
            class="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 text-sm">
            <div>
              <p class="font-semibold text-gray-800">{{ item.nombre }}</p>
              <p class="text-gray-400 text-xs">
                Base ${{ item.precio_base.toLocaleString() }}
                <span v-if="item.recargo_dificultad > 0"> · +${{ item.recargo_dificultad }} dificultad</span>
                <span v-if="item.recargo_irregular > 0"> · +${{ item.recargo_irregular }} irregular</span>
                <span v-if="item.nota"> — {{ item.nota }}</span>
              </p>
            </div>
            <span class="font-bold text-gray-800">${{ item.subtotal.toLocaleString() }}</span>
          </div>
          <div v-if="(quoteResult.recargo_ruta ?? 0) > 0"
            class="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 text-sm">
            <span class="text-gray-600">Recargo de ruta ({{ serviceTypeLabel }})</span>
            <span class="font-semibold text-gray-800">+${{ quoteResult.recargo_ruta.toLocaleString() }}</span>
          </div>
          <div v-if="(quoteResult.recargo_extras ?? 0) > 0"
            class="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 text-sm">
            <span class="text-gray-600">Extras (protección / dificultad)</span>
            <span class="font-semibold text-gray-800">+${{ quoteResult.recargo_extras.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Total -->
        <div class="rounded-2xl p-5 mb-5 text-center" style="background-color: #FFF5F5; border: 2px solid #FCA5A5">
          <p class="text-gray-500 text-xs mb-1 uppercase tracking-wide">Total estimado</p>
          <p class="text-4xl font-extrabold" style="color: #DC2626">
            ${{ quoteResult?.total?.toLocaleString() ?? '—' }}
            <small class="text-base font-normal text-gray-400 ml-1">MXN</small>
          </p>
          <p class="text-gray-400 text-xs mt-1">Precio final se confirma al verificar la carga · válida 48 h · ±15%</p>
        </div>

        <p v-if="quoteResult?.comentario" class="text-sm text-gray-600 italic mb-5 px-2">
          "{{ quoteResult.comentario }}"
        </p>

        <!-- CTAs -->
        <div class="flex flex-col gap-3">
          <a :href="whatsappLink" target="_blank"
            class="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-white font-bold text-base hover:opacity-90 transition-opacity"
            style="background-color: #16A34A">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.552 4.103 1.517 5.829L.057 23.486a.5.5 0 00.612.612l5.693-1.467A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.722.959.984-3.607-.235-.371A9.818 9.818 0 1112 21.818z"/>
            </svg>
            Confirmar por WhatsApp
          </a>
          <RouterLink to="/register"
            class="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-base border-2 hover:opacity-80 transition-opacity"
            style="border-color: #DC2626; color: #DC2626">
            Crear cuenta y confirmar en línea →
          </RouterLink>
          <button @click="resetForm" class="text-gray-400 text-sm hover:text-gray-600 transition-colors py-2">
            Hacer otra cotización
          </button>
        </div>
      </div>
    </div>

    <!-- Navegación -->
    <div v-if="step < 6" class="flex justify-between mt-10">
      <button v-if="step > 1" @click="prevStep"
        class="border-2 border-red-400 text-red-500 px-10 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors">
        Anterior
      </button>
      <div v-else />
      <button @click="nextStep"
        :disabled="!canProceed || analyzing || quoting"
        class="text-white px-10 py-3 rounded-lg font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
        style="background-color: #DC2626">
        {{ nextLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Formulario de cotización de la landing — guía al usuario en 6 pasos para cotizar un flete.
// Pasos: (1) ubicaciones y contacto, (2) fotos de la carga, (3) protección, (4) dificultad,
// (5) análisis con IA de las imágenes, (6) resultado con precio y enlace a WhatsApp.
import { ref, reactive, computed } from 'vue'
import StepIndicator from '@/components/StepIndicator.vue'

interface AnalyzedItem {
  nombre: string
  emoji: string
  estimacion_automatica: boolean
  tamano_categoria: 'pequeño' | 'mediano' | 'grande' | 'extra_grande'
  largo_cm: number | null
  ancho_cm: number | null
  alto_cm: number | null
  peso_kg: number | null
  es_irregular: boolean
  dificultad: 'normal' | 'moderada' | 'alta'
  razon_dificultad: string | null
  confianza: number
  razon_manual: string | null
  guia_foto: string | null
}

interface ManualDim {
  largo: string
  ancho: string
  alto: string
  peso: string
}

interface DesglosItem {
  nombre: string
  precio_base: number
  recargo_dificultad: number
  recargo_irregular: number
  subtotal: number
  nota: string
}

interface QuoteResult {
  desglose: DesglosItem[]
  subtotal_objetos: number
  recargo_ruta: number
  recargo_extras: number
  total: number
  comentario: string
}

const step = ref(1)
const analyzing = ref(false)
const quoting = ref(false)
const analyzingMsg = ref('La IA está identificando los objetos en tus fotos')
const analyzeError = ref('')
const aiMessage = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const previewUrls = ref<string[]>([])
const analyzedItems = ref<AnalyzedItem[]>([])
const manualDims = ref<ManualDim[]>([])
const quoteResult = ref<QuoteResult | null>(null)

const form = reactive({
  origin: '',
  destination: '',
  destinationType: 'local' as 'local' | 'foraneo' | 'belice',
  floorNumber: '',
  contactName: '',
  contactPhone: '',
  references: '',
  images: [] as File[],
  protection: [] as string[],
  difficulties: [] as string[],
})

const emptySlots = computed(() => Math.max(0, 4 - previewUrls.value.length))
const itemsNeedingInfo = computed(() => analyzedItems.value.filter(o => !o.estimacion_automatica))

const serviceTypeLabel = computed(() => {
  if (form.destinationType === 'belice') return 'Internacional — Belice'
  if (form.destinationType === 'foraneo') return 'Foráneo — México'
  return 'Local — Chetumal'
})

const whatsappLink = computed(() => {
  const total = quoteResult.value?.total ?? 0
  const msg = encodeURIComponent(
    `Hola, tengo una cotización generada en su sitio web.\n\n` +
    `📍 Origen: ${form.origin}\n` +
    `📍 Destino: ${form.destination}\n` +
    `🚛 Tipo: ${serviceTypeLabel.value}\n` +
    `💰 Total estimado: $${total.toLocaleString()} MXN\n` +
    `👤 Nombre: ${form.contactName}\n` +
    `📞 Teléfono: ${form.contactPhone}\n\n` +
    `¿Pueden confirmar disponibilidad?`
  )
  return `https://wa.me/529831015526?text=${msg}`
})

const stepTitle = computed(() => {
  const titles: Record<number, string> = {
    1: 'Díganos las ubicaciones a donde recoger el objeto y a donde transportarlo',
    2: 'Suba imágenes de la carga a transportar (la IA las analizará automáticamente)',
    3: '¿Sus objetos necesitarán protección adicional?',
    4: '¿Su carga es difícil de transportar? Puede escoger más de una, si no aplica puede proseguir',
    5: analyzing.value ? 'Analizando datos con inteligencia artificial...'
      : quoting.value ? 'Generando cotización...'
      : analyzeError.value ? 'Error en el análisis'
      : 'Objetos detectados — revisa y completa si hay datos faltantes',
    6: '¡Tu cotización está lista!',
  }
  return titles[step.value] ?? ''
})

const nextLabel = computed(() => {
  if (step.value === 5 && !analyzing.value && !quoting.value && !analyzeError.value) return 'Ver cotización'
  return 'Siguiente'
})

const canProceed = computed(() => {
  if (step.value === 1) return !!(form.origin.trim() && form.destination.trim() && form.contactName.trim())
  if (step.value === 2) return form.images.length > 0
  if (step.value === 5) return !analyzing.value && !quoting.value && analyzedItems.value.length > 0 && !analyzeError.value
  return true
})

const inputClass = 'w-full border border-red-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 placeholder-red-200'

const uploadTips = [
  { icon: '💡', text: 'Asegúrese de tomar las fotos con buena iluminación' },
  { icon: '🧍', text: 'Incluya una persona o puerta como referencia de tamaño' },
  { icon: '📐', text: 'Fotos desde arriba, a los lados y de frente' },
]

const protectionMaterials = [
  { id: 'carton', label: 'Papel cartón', icon: '📦', bg: '#D4A574' },
  { id: 'burbujas', label: 'Papel de burbujas', icon: '🫧', bg: '#A8D5E2' },
  { id: 'espuma', label: 'Papel espuma', icon: '🌫️', bg: '#E8E8E8' },
  { id: 'film', label: 'Papel film', icon: '🎞️', bg: '#C8E6C9' },
  { id: 'espuma_prot', label: 'Espuma protectora', icon: '🧱', bg: '#FFE0B2' },
]

const difficultyOptions = [
  { id: 'planta_alta', label: 'Está en planta alta', description: '(Segundo/tercer piso)' },
  { id: 'escaleras', label: 'Escaleras estrechas', description: '(Complicado moverlo por las escaleras)' },
  { id: 'espacio', label: 'Espacio reducido', description: '(El espacio de maniobra es reducido)' },
  { id: 'maniobrabilidad', label: 'Difícil maniobrabilidad', description: '(Objeto poco maniobrable)' },
  { id: 'puertas', label: 'Puertas angostas', description: '(Las puertas son estrechas para mover)' },
  { id: 'ventana', label: 'Se extrae por la ventana', description: '(Solo se puede extraer por ventana)' },
]

const triggerFileInput = () => fileInputRef.value?.click()

const onFilesSelected = (e: Event) => {
  addFiles(Array.from((e.target as HTMLInputElement).files ?? []))
}

const onDrop = (e: DragEvent) => {
  addFiles(Array.from(e.dataTransfer?.files ?? []))
}

const addFiles = (files: File[]) => {
  const allowed = 5 - form.images.length
  files.slice(0, allowed).forEach((f) => {
    form.images.push(f)
    previewUrls.value.push(URL.createObjectURL(f))
  })
}

const removeImage = (i: number) => {
  URL.revokeObjectURL(previewUrls.value[i] ?? '')
  previewUrls.value.splice(i, 1)
  form.images.splice(i, 1)
}

const toggleProtection = (id: string) => {
  const i = form.protection.indexOf(id)
  i === -1 ? form.protection.push(id) : form.protection.splice(i, 1)
}

const toggleDifficulty = (id: string) => {
  const i = form.difficulties.indexOf(id)
  i === -1 ? form.difficulties.push(id) : form.difficulties.splice(i, 1)
}

const toBase64 = (file: File): Promise<{base64: string, mime: string}> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      resolve({ base64: result.split(',')[1], mime: file.type })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const cycleMessages = () => {
  const msgs = [
    'La IA está identificando los objetos en tus fotos',
    'Estimando dimensiones y peso aproximado...',
    'Clasificando objetos según base de datos...',
    'Verificando si se necesita información adicional...',
  ]
  let i = 0
  return setInterval(() => {
    i = (i + 1) % msgs.length
    analyzingMsg.value = msgs[i]
  }, 1800)
}

const realAnalyzeImages = async () => {
  analyzing.value = true
  analyzeError.value = ''
  analyzedItems.value = []
  const interval = cycleMessages()

  try {
    const images = await Promise.all(form.images.map(toBase64))
    const res = await fetch('/api/quote/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images, zone: form.origin }),
    })
    if (!res.ok) throw new Error('Error al conectar con el servidor de análisis')
    const data = await res.json()
    aiMessage.value = data.mensaje ?? ''
    analyzedItems.value = data.objetos ?? []
    manualDims.value = analyzedItems.value
      .filter(o => !o.estimacion_automatica)
      .map(() => ({ largo: '', ancho: '', alto: '', peso: '' }))
  } catch (err) {
    analyzeError.value = err instanceof Error ? err.message : 'Error al analizar las imágenes'
  } finally {
    clearInterval(interval)
    analyzing.value = false
  }
}

const retryAnalysis = () => {
  analyzeError.value = ''
  realAnalyzeImages()
}

const generateRealQuote = async () => {
  // Completar dimensiones manuales
  const needsInfo = analyzedItems.value.filter(o => !o.estimacion_automatica)
  for (let i = 0; i < needsInfo.length; i++) {
    const d = manualDims.value[i]
    if (!d?.largo || !d?.ancho || !d?.alto || !d?.peso) {
      alert(`Completa los datos de: ${needsInfo[i].nombre}`)
      return
    }
    const idx = analyzedItems.value.indexOf(needsInfo[i])
    analyzedItems.value[idx].largo_cm = Number(d.largo)
    analyzedItems.value[idx].ancho_cm = Number(d.ancho)
    analyzedItems.value[idx].alto_cm = Number(d.alto)
    analyzedItems.value[idx].peso_kg = Number(d.peso)
    analyzedItems.value[idx].estimacion_automatica = true
  }

  quoting.value = true
  try {
    const res = await fetch('/api/quote/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        objetos: analyzedItems.value,
        zone: form.origin,
        tipo: form.destinationType,
        proteccion: form.protection,
        dificultades: form.difficulties,
      }),
    })
    if (!res.ok) throw new Error('Error al calcular la cotización')
    quoteResult.value = await res.json()
    step.value = 6
  } catch (err) {
    analyzeError.value = err instanceof Error ? err.message : 'Error al calcular la cotización'
  } finally {
    quoting.value = false
  }
}

const nextStep = async () => {
  if (step.value === 4) { step.value = 5; await realAnalyzeImages(); return }
  if (step.value === 5) { await generateRealQuote(); return }
  if (step.value < 6) step.value++
}

const prevStep = () => { if (step.value > 1) step.value-- }

const resetForm = () => {
  step.value = 1
  analyzing.value = false
  quoting.value = false
  analyzeError.value = ''
  aiMessage.value = ''
  quoteResult.value = null
  previewUrls.value.forEach(url => URL.revokeObjectURL(url))
  previewUrls.value = []
  analyzedItems.value = []
  manualDims.value = []
  form.origin = ''
  form.destination = ''
  form.destinationType = 'local'
  form.floorNumber = ''
  form.contactName = ''
  form.contactPhone = ''
  form.references = ''
  form.images = []
  form.protection = []
  form.difficulties = []
}
</script>
