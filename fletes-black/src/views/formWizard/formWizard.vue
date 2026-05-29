<!-- src/views/FleteWizardView.vue -->
<script setup>
import { ref, computed } from 'vue'

// 1. Importamos los componentes de cada paso
import PasoUno from '@/views/formWizard/wizStep1.vue'
import PasoDos from '@/views/formWizard/wizStep2.vue'
import PasoTres from '@/views/formWizard/wizStep3.vue'
import PasoCuatro from '@/views/formWizard/wizStep4.vue'
import PasoCinco from '@/views/formWizard/wizStep5.vue'

// 2. Estado del Wizard (En qué paso estamos)
const pasoActual = ref(1)
const totalPasos = 5

// 3. El "Cofre de Datos" (Aquí se guarda TODO lo que el usuario escriba)
const formulario = ref(
{
    // Datos del Paso 1 (Flete - 1.png)
    origen: '',
    destino: '',
    interior: '',
    nombreCliente: '',
    referencias: '',
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

// 5. Funciones de navegación con validaciones básicas
const irAtras = () =>
{
    if (pasoActual.value > 1)
    {
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

const enviarFormularioFinal = () =>
{
  console.log('¡Formulario completado! Enviando a la API:', formulario.value)
  // Aquí harías tu petición axios/fetch final
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
            <button class="btn btn-anterior" :disabled="pasoActual === 1" @click="irAtras">
                Anterior
            </button>
            
            <button class="btn btn-siguiente" @click="irSiguiente">
                {{ pasoActual === totalPasos ? 'Finalizar' : 'Siguiente' }}
            </button>
        </footer>
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
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-anterior
{
  background-color: transparent;
  border: 2px solid #ff5a5a;
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
</style>