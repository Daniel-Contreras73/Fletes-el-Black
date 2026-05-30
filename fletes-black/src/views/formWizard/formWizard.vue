<!-- src/views/FleteWizardView.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import PasoUno from '@/views/formWizard/wizStep1.vue'
import PasoDos from '@/views/formWizard/wizStep2.vue'
import PasoTres from '@/views/formWizard/wizStep3.vue'
import PasoCuatro from '@/views/formWizard/wizStep4.vue'
import PasoCinco from '@/views/formWizard/wizStep5.vue'

const router = useRouter()

//Estado del Wizard (En qué paso se posiciona)
const pasoActual = ref(1)
const totalPasos = 5

//Estado para controlar la visibilidad del Modal de cancelación
const mostrarModalCancelacion = ref(false)

//Aquí se guarda lo que el usuario escriba
const formulario = ref(
{
    origen: '',
    destino: '',
    interior: '',
    nombreCliente: '',
    referencias: '',
    imagenes: [],
})

// 4. Propiedad computada para saber qué componente mostrar en pantalla
const componenteActual = computed(() =>
{
    switch (pasoActual.value)
    {
        case 1: return PasoUno
        case 2: return PasoDos
        case 3: return PasoTres
        case 4: return PasoCuatro
        case 5: return PasoCinco
        default: return PasoUno
    }
})

// 5. Funciones de navegación con la nueva lógica del botón izquierdo
const irAtras = () =>
{
    // Si está en el primer paso, interceptamos el clic para abrir el modal
    if (pasoActual.value === 1)
    {
        mostrarModalCancelacion.value = true
    }
    else
    {
        // Si está en cualquier otro paso, simplemente retrocede de forma normal
        pasoActual.value--
    }
}

const irSiguiente = () =>
{
    if (pasoActual.value < totalPasos)
    {
        pasoActual.value++
    }
    else
    {
        enviarFormularioFinal()
    }
}

//Funciones exclusivas del Modal
const cerrarModal = () => 
{
  mostrarModalCancelacion.value = false
}

const confirmarCancelacion = () =>
{
    mostrarModalCancelacion.value = false
    // Redirige a donde se quiera ir (de preferencia a Dashboard, cambiar segun convenga)
    router.push({ path: '/login' }) 
}

const enviarFormularioFinal = () =>
{
    console.log('Formulario completado, Enviando a la API:', formulario.value)
}
</script>

<template>
    <div class="wizard-container">
      <!-- BARRA DE PROGRESO (Círculos del 1 al 6) -->
      <header class="wizard-header">
          <div class="pasos-indicador">
              <div v-for="paso in totalPasos"   :key="paso"   class="circulo"
              :class="{ 'activo': paso === pasoActual, 'completado': paso < pasoActual }">
                {{ paso }}
              </div>
          </div>
      </header>

      <!-- CONTENEDOR DINÁMICO -->
      <main class="wizard-body">
          <component :is="componenteActual" v-model="formulario" />
      </main>

      <!-- BOTONES (Anterior / Siguiente) -->
      <footer class="wizard-footer">
          <button class="btn btn-anterior" @click="irAtras">
              {{ pasoActual === 1 ? 'Cancelar flete' : 'Anterior' }}
          </button>
          
          <button class="btn btn-siguiente" @click="irSiguiente">
              {{ pasoActual === totalPasos ? 'Finalizar' : 'Siguiente' }}
          </button>
      </footer>

      <!-- El Modal de cancelacion -->
      <div v-if="mostrarModalCancelacion" class="modal-overlay" @click.self="cerrarModal">
          <div class="modal-contenido">
              <h3 class="modal-titulo">¿Estás seguro de cancelar el flete?</h3>
              <p class="modal-texto">Si cancelas ahora, no se guardará la información ingresada.</p>
              
              <div class="modal-botones">
                  <button class="btn btn-anterior" @click="cerrarModal">
                      No, continuar flete
                  </button>
                  <button class="btn btn-siguiente btn-peligro" @click="confirmarCancelacion">
                      Sí, cancelar
                  </button>
              </div>
          </div>
      </div>
    </div>
</template>

<style scoped>
/* Estilos base para estructurar el Layout del Wizard */
.wizard-container
{
  max-width: 95%;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
}

.wizard-header
{
  margin-bottom: 30px;
  width: 45%;
}

/* - - - - - - - - - - HEADER (los numeros) - - - - - - - - - - */
.pasos-indicador
{
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.circulo
{
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid #ff5a5a;
  color: #ff5a5a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

/* El circulo rojo (Paso activo) */
.circulo.activo
{
  background-color: #ff5a5a;
  color: #fff9f9;
  font-size: 1.8rem;
}

/* Cuando se completa y pasa a otro circulo */
.circulo.completado
{
  background-color: #ffe5e5;
  border-color: #ff5a5a;
}

/* - - - - - - - - - - BODY (El entremedio del Wizard donde van los componentes) - - - - - - - - - - */
.wizard-body
{
  flex-grow: 1;
  width: 100%;
  min-height: 31rem;
  max-height: 31rem;
  padding: 1.7rem 0;
}

/* - - - - - - - - - - FOOTER (Los botones atras-adelante) - - - - - - - - - - */
.wizard-footer
{
  display: flex;
  width: 100%;
  gap: 15px;
}

.btn
{
  flex: 1;
  padding: 0.7rem 1rem;
  font-size: 1.5rem;
  font-weight: 550;
  /* border-radius: 4px; */
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-anterior
{
  background-color: transparent;
  border: 3px solid #ff5a5a;
  color: #ff5a5a;
}

.btn-anterior:hover {background-color: #ffe5e5;}

.btn-anterior:disabled
{
  border-color: #ccc;
  color: #ccc;
  cursor: not-allowed;
}

.btn-siguiente
{
  background: #ff5858;
  border: none;
  color: #fff9f9;
}

.btn-siguiente:hover {background: #df3a3a;}

/* - - - - - - - - - - EL MODAL DE CANCELACIÓN DE FLETES - - - - - - - - - - */
.modal-overlay
{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-contenido
{
  background-color: #fff9f9;
  padding: 30px;
  /* border-radius: 8px; */
  width: 70%;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.modal-titulo
{
  color: #bf2c2c;
  font-size: 2.5rem;
  font-weight: 550;
}

.modal-texto
{
  color: #bf2c2c;
  margin-bottom: 1.6rem;
  font-size: 1.3rem;
  font-weight: 500;
}

.modal-botones
{
  display: flex;
  gap: 15px;
}

.btn-peligro {background-color: #d9534f;}

.btn-peligro:hover {background-color: #c9302c;}
</style>