<!-- celdaCalendario.vue -->
<script setup lang="ts">
import { ref, watchEffect} from 'vue'
import { eliminarEvento,obtenerEventos} from '@/api'
import { useEventosStore } from '@/store/eventosStore'
import compModal from './compModal.vue'
import type { Evento } from '@/interface/interfaces'

interface Props {
  fecha: string
}

const store = useEventosStore()

const emits = defineEmits<{
  dragEvento : [evento:Evento]
}>()
const props = defineProps<Props>()
const mostrarModal = ref(false)
const eventoModificar = ref<Evento | null>(null)
const draggedItem = ref<Evento>()
const eventosFiltrados=ref<Evento[]>([])


watchEffect(()=>{
  eventosFiltrados.value=store.eventosPorFecha(props.fecha)
}
)

// Función para eliminar un evento
const eliminarEventoLocal = async (id: number) => {
  try {
    // Eliminar el evento del JSON
    await eliminarEvento(id)
    store.eventos=await obtenerEventos()
  } catch (error) {
    console.error('Error al eliminar el evento:', error)
  }
}

const abrirModal = () => {
  mostrarModal.value = true
}

const abrirModalModificar = (evento: Evento): void => {
  eventoModificar.value = evento
  abrirModal()
}

const cerrarModal = () => {
  mostrarModal.value = false
  eventoModificar.value = null
}
const controlarEmit = () => {
  cerrarModal()
}

const handleDragStart = (evento:Evento) =>{
  draggedItem.value=evento
  emits('dragEvento',draggedItem.value)
}


</script>

<template>
  <div class="cell">
    <div class="dentroCell">
      <p>{{ props.fecha.split('-')[2] }}</p>
      <button id="btnAbrirModal" v-if="props.fecha" @click="abrirModal"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
</svg></button>
    </div>
        <div class="divEvento"
         v-for="evento in eventosFiltrados" 
         :key="evento.id" 
         :draggable="true"
         @dragstart="handleDragStart(evento)" >
          <p>{{ evento.titulo }}</p>
          <div class="botones">
          <button class="btnEliminarEvento" @click="eliminarEventoLocal(evento.id)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg>
          </button>
          <button class="btnModificarEvento" @click="abrirModalModificar(evento)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
            </svg>     
          </button>
          </div>
        </div>
    <compModal :fecha="props.fecha" :evento="eventoModificar" v-if="mostrarModal" @cerrar="controlarEmit" />
  </div>
</template>

<style scoped>
.cell {
  width: 100%;
  height: 100%;
}

.dentroCell {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dentroCell p {
  margin: 0;
  margin-left: 20px;
  padding: 0;
}

  #btnAbrirModal {
    margin-right: 10px;
    font-size: 20px;
    border-radius: 50%;
    background-color: transparent;
    cursor: pointer;
    border: 2px solid greenyellow; /* Agregamos un borde */
    /* Añadimos un poco de espacio alrededor del icono */
    transition: background-color 0.3s ease; /* Agregamos transición para el color de fondo */
  }

  #btnAbrirModal:hover {
    background-color: greenyellow; /* Cambiamos el color de fondo al pasar el mouse */
  }


.divEvento {
  background-color: darkblue;
  border: 1px solid white;
  padding-left: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.divEvento p {
  margin: 0;
  padding: 0;
  font-size: 12px;
  color: white;
}

.btnEliminarEvento,
.btnModificarEvento {
  width: 30px;
  height: 30px;
  font-size: 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  color: white;
}

.btnEliminarEvento:hover {
  color: #ff0000;
}
.btnModificarEvento:hover{
  color: green;
}
.botones {
  display: flex;
  gap: 10px;
}
</style>

