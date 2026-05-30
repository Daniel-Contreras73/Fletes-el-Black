<script setup>
import { ref, onMounted } from 'vue'

const formulario = defineModel()

const fileInput = ref(null)

const arrastrando = ref(false)

onMounted(() =>
{
    if (!formulario.value.imagenes)
    {
        formulario.value.imagenes = []
    }
})

const abrirBuscadorArchivos = () =>
{
    fileInput.value.click()
}

const procesarArchivos = (archivos) =>
{
    const archivosArray = Array.from(archivos)
    const espacioDisponible = 4 - formulario.value.imagenes.length

    if (espacioDisponible <= 0) return //Si ya hay 4, no hace nada

    const archivosPermitidos = archivosArray.slice(0, espacioDisponible)

    archivosPermitidos.forEach(archivo =>
    {
        if (archivo.type.startsWith('image/'))
        {
        const url = URL.createObjectURL(archivo)
        formulario.value.imagenes.push({ file: archivo, url: url })
        }
    })
}

const manejarSeleccion = (evento) =>
{
    procesarArchivos(evento.target.files)
    evento.target.value = '' // Limpiar el input para poder subir la misma imagen si se borra
}

const manejarDrop = (evento) =>
{
    arrastrando.value = false
    procesarArchivos(evento.dataTransfer.files)
}

const eliminarImagen = (index) =>
{
    URL.revokeObjectURL(formulario.value.imagenes[index].url)
    formulario.value.imagenes.splice(index, 1)
}
</script>

<template>
    <div class="wizStep2-Container">
        <h2 class="title">Suba imágenes de la carga a transportar</h2>

        <div class="columnas">
            <!-- Columna de tips -->
            <div class="col1Tips">
                <div class="col1Tips-Card">
                    <span class="col1Tips-Card-Icon">💡</span>
                    <p>Asegúrese de tomar las fotos<br>con suficiente luz, evitar oscuridad</p>
                </div>
                <div class="col1Tips-Card">
                    <span class="col1Tips-Card-Icon">🧍🏼‍♂️</span>
                    <p>Incluya a una persona o puerta<br>como referencia</p>
                </div>
                <div class="col1Tips-Card">
                    <span class="col1Tips-Card-Icon">📦</span>
                    <p>Ordene sus objetos y haga que<br>aparezcan en las fotos</p>
                </div>
            </div>
            <!-- Area de subida de imagenes -->
            <div class="col2Upload":class="{ 'arrastrando-activo': arrastrando }"
            @click="abrirBuscadorArchivos" @dragover.prevent="arrastrando = true" @dragleave.prevent="arrastrando = false" @drop.prevent="manejarDrop">
                <div class="col2Upload-Instruct">
                    <img src="@/assets/Multimedia/iconUpload2.png" alt="" class="col2Upload-Instruct-Icon">
                    <p class="col2Upload-Instruct-Title">Subir imagen<br>o arrastra aquí</p>
                    <p class="col2Upload-Instruct-Subtitle">Máximo 4 imagenes</p>
                </div>
                
                <input type="file" ref="fileInput" multiple accept="image/*" @change="manejarSeleccion" style="display: none;" />
            </div>
            <!-- Galeria de imagenes -->
            <div class="col3Gallery">
                <div v-for="(imagen, index) in formulario.imagenes"   :key="index"   class="col3Gallery-ImgPreview">
                    <img :src="imagen.url" alt="Preview de carga" />
                    <button class="col3Gallery-Img-Delete" @click.stop="eliminarImagen(index)">✖</button>
                </div>
                
                <div v-for="n in (4 - (formulario.imagenes?.length || 0))"   :key="'vacio-'+n"   class="col3Gallery-EmptySpace"  ></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.wizStep2-Container
{
    height: 100%; 
    display: flex;
    flex-direction: column;
}

.title
{
    color: #b32626;
    font-size: 1.7rem;
    font-weight: 550;
    text-align: center;
    margin-bottom: 10px;
}

/* --- LAYOUT PRINCIPAL --- */
.columnas
{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
    align-items: stretch;
    flex-grow: 1;
    min-height: 0;
}

/* --- COLUMNA 1: TIPS --- */
.col1Tips
{
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.col1Tips-Card
{
    background-color: #df3a3a;
    color: #fff9f9;
    padding: 10px 5px;
    text-align: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.col1Tips-Card .col1Tips-Card-Icon {font-size: 2.2rem;}

.col1Tips-Card p
{
    margin: 0;
    font-size: 1.05rem;
    font-weight: 450;
    line-height: 1.15;
}

/* --- COLUMNA 2: SUBIR IMAGENES --- */
.col2Upload
{

    border: 3px dashed #df3a3a;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: transparent;
}

.col2Upload.arrastrando-activo
{
    background-color: #ffe5e5;
    border-style: dashed;
}

.col2Upload:hover {background-color: #fff9f9;}

.col2Upload-Instruct
{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.col2Upload-Instruct-Icon
{
    width: 3.7rem;
    margin-bottom: 5px;
}

.col2Upload-Instruct-Title
{
    font-size: 1.45rem;
    font-weight: 570;
    color: #bf2c2c;
}

.col2Upload-Instruct-Subtitle
{
    color: #ff5858;
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
}

/* --- COLUMNA 3: GALERIA --- */
.col3Gallery
{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-content: start;
    height: 100%;
}

.col3Gallery-ImgPreview
{
    position: relative;
    overflow: hidden;
    background-color: #954d4d;
    width: 100%; 
    aspect-ratio: 7 / 6;
}

.col3Gallery-ImgPreview img
{
    width: 100%;
    height: 100%;
    object-fit: cover; 
    display: block;
}

.col3Gallery-Img-Delete
{
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: rgba(30, 30, 30, 0.7);
    color: #fff9f9;
    border: none;
    /* border-radius: 50%; */
    width: 25px;
    height: 25px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color ease 0.15s;
}

.col3Gallery-Img-Delete:hover {background-color: rgba(220, 53, 69, 0.9);}

.col3Gallery-EmptySpace
{
    background-color: #d5d5d5;
    width: 100%;
    aspect-ratio: 7 / 6;
}

/* --- RESPONSIVIDAD --- */
@media (max-width: 900px)
{
    .columnas
    {
        grid-template-columns: 1fr;
    }
    .col3Gallery
    {
        min-height: 250px;
    }
}
</style>