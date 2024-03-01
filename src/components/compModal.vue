<script setup lang="ts">
import { ref } from 'vue'
import { crearEvento, modificarEvento, obtenerEventos } from '@/api'
import { useEventosStore } from '@/store/eventosStore'
import type { Evento } from '@/interface/interfaces'
interface Props {
  fecha?: string
  evento: Evento|null
}

const store = useEventosStore()

const titulo = ref<string>('')
const descripcion=ref<string>(' ')
const fechaModificada=ref<string|undefined>('')

const emits = defineEmits(['cerrar'])
const props = defineProps<Props>()

titulo.value = props.evento? props.evento.titulo : ''
descripcion.value = props.evento? props.evento.descripcion : ''
fechaModificada.value =  props.evento? props.evento.fecha: props.fecha

// Método para generar un ID aleatorio
const generarID = () => {
  return Math.floor(Math.random() * 100000)
}

// Método para guardar el evento (ya sea creación o modificación)
const guardarEvento = async () => {
  const eventoModificado = {
    id: props.evento ? props.evento.id : generarID(),
    fecha: fechaModificada.value!,
    titulo: titulo.value.toUpperCase(),
    descripcion: descripcion.value
  }

  if (props.evento) {
    await modificarEvento(eventoModificado)
  } else {
    await crearEvento(eventoModificado)
  }
  // Limpia el formulario y cierra el modal después de guardar
  titulo.value = ''
  descripcion.value = ''
  emits('cerrar')
  store.eventos=await obtenerEventos()

}


</script>

<template>
    <div class="modal" >
      <div class="modal-content">
        <span class="close" @click="emits('cerrar')">&times;</span>
        <h2>{{ props.evento ? 'Modificar Evento' : 'Nuevo Evento' }}</h2>
        <h3 v-if="!props.evento">{{ props.fecha }}</h3>
        <form @submit.prevent="guardarEvento">
          <input v-if="props.evento" type="date" id="fecha" v-model="fechaModificada"><br>
          <label for="titulo">Título:</label><br>
          <input type="text" id="titulo" v-model="titulo" required><br>
          <label for="descripcion">Descripción:</label><br>
          <textarea id="descripcion" v-model="descripcion" required></textarea><br>
          <button type="submit">{{ props.evento? 'Modificar' : 'Guardar' }}</button>
        </form>
      </div>
    </div>
  </template>
  
  <style scoped>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    width: 60%;
    max-width: 500px;
    position: relative; /* Agregamos esta línea */
  }
  
  .close {
    color: #000000;
    position: absolute; /* Cambiamos a posición absoluta */
    font-size: 30px; /* Modificamos el tamaño del icono de cierre */
    cursor: pointer;
    right: 15px; /* Lo ubicamos a 15px de la derecha del modal */
    top: 15px; /* Lo ubicamos a 15px del borde superior del modal */
  }
  
  .close:hover,
  .close:focus {
    color: rgb(255, 0, 0);
    text-decoration: none;
    cursor: pointer;
  }
  
  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  label {
    font-size: 16px;
    margin-bottom: 5px;
  }
  
  input[type="text"],
  input[type="date"],
  textarea {
    padding: 10px;
    font-size: 16px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button[type="submit"] {
    padding: 10px 20px;
    font-size: 18px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button[type="submit"]:hover {
    background-color: #0056b3;
  }
  </style>
  
  
