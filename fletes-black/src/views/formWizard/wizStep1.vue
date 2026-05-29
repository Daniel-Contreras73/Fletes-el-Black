<script setup>
// defineModel captura automáticamente el objeto 'formulario' que le pasamos desde el Padre con v-model.
// Cualquier cambio en los inputs actualizará el estado central del Padre en tiempo real.
const formulario = defineModel()
</script>

<template>
    <div class="paso-uno-container">
        <h2 class="titulo-paso">Díganos las ubicaciones a donde recoger el objeto y a donde transportarlo</h2>

        <div class="formulario-grid">        
            <div class="grupo-input">
                <label for="origen">Origen (Punto A)</label>
                <input id="origen"type="text" v-model="formulario.origen" placeholder="Ej. Calle Belgrano con Heroes"/>
            </div>
            <div class="grupo-input">
                <label for="destino">Destino (Punto B)</label>
                <input id="destino"type="text" v-model="formulario.destino" placeholder="Ej. Av. Insurgentes 212"/>
            </div>
            <div class="grupo-input">
                <label for="interior">Número interior / Departamento (opcional)</label>
                <input id="interior"type="text" v-model="formulario.interior" placeholder="#113"/>
            </div>
            <div class="grupo-input">
                <label for="nombre">Su nombre</label>
                <input id="nombre"type="text" v-model="formulario.nombreCliente" placeholder="Sergio Pérez"/>
            </div>
            <div class="grupo-input ancho-completo">
                <label for="referencias">Referencias de domicilio/empresa de origen (el punto A)</label>
                <input id="referencias"type="text" v-model="formulario.referencias" placeholder="Ej. Maderería 'Gallardo' es un edificio de dos pisos con una estatua fuera y color naranja"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
.paso-uno-container {padding: 10px 20px;}



.titulo-paso
{
    color: #bf2c2c;
    font-size: 1.7rem;
    font-weight: 550;
    text-align: center;
    margin-bottom: 30px;
}

/* Usamos CSS Grid para dividir en dos columnas iguales */
.formulario-grid
{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 30px;
}

/* Modificador para que un campo ocupe ambas columnas */
.ancho-completo
{
    grid-column: 1 / -1;
}

.grupo-input
{
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
}

label
{
    color: #bf2c2c;
    font-size: 1.3rem;
    font-weight: 500;
    cursor: pointer;
}

input
{
    padding: 12px 15px;
    font-size: 1.15rem;
    font-weight: 450;
    border: 3.2px solid #ff5858;
    /* border-radius: 2px; */
    outline: none;
    background-color: transparent;
    color: #b32626;
    transition: border-color ease 0.3s;
}

/* Efecto al hacer clic en el input */
input:focus
{
    border-color: #bf2c2c;
}

/* Estilos para el texto de ejemplo (placeholder) */
input::placeholder
{
    color: #999;
    font-style: italic;
}

/* Diseño Responsivo: Si la pantalla es pequeña (móvil), pasamos a una sola columna */
@media (max-width: 600px)
{
    .formulario-grid
    {
        grid-template-columns: 1fr; /* Todo en 1 columna */
    }
}
</style>