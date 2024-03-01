<script setup lang="ts">
import {computed,onMounted,ref } from 'vue'
import celdaCalendario from '@/components/celdaCalendario.vue'
import { modificarEvento } from '@/api'
import type { Evento,calendarioTabla } from '@/interface/interfaces'
import { useEventosStore } from '@/store/eventosStore'
import { obtenerEventos } from '@/api'


const store = useEventosStore()
const emits = defineEmits(['mesMenos','mesMas'])

const props = withDefaults(defineProps<calendarioTabla>(),{
            cols: ()=> ['Lunes', 'Martes', 'Miércoles', 'Jueves','Viernes','Sábado', 'Domingo'],
            COLS: 7,
            ROWS: 6,
            anio: 2000,
            mes: 1


})
onMounted(async()=>{
  store.eventos= await obtenerEventos()
})

const tablaMes = computed(() => {
  const celdas: string[][] = []

  // Inicializamos la matriz de celdas con cadenas vacías
  for (let i = 0; i < props.ROWS; i++) {
    celdas.push(Array(props.COLS).fill(''))
  }

  const primerDia = new Date(props.anio, props.mes - 1, 1)
  const posicionPrimerDia = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1
  const numDiasMes = new Date(props.anio, props.mes, 0).getDate()

  let contador = 1
  for (let fila = 0; fila < props.ROWS; fila++) {
    for (let columna = 0; columna < props.COLS; columna++) {
      if (fila === 0 && columna < posicionPrimerDia) {
        // Dejamos las primeras celdas vacías si no pertenecen al mes actual
        continue
      }
      if (contador > numDiasMes) {
        // Si ya hemos añadido todos los días del mes, salimos del bucle
        break
      }
      const day = contador.toString().padStart(2, '0')
      const fecha = `${props.anio}-${props.mes.toString().padStart(2, '0')}-${day}`
      celdas[fila][columna] = fecha
      contador++
    }
    if (contador > numDiasMes) {
      break
    }
  }
  return celdas
})


const draggedItem = ref<Evento>()

const recogerDrag = (obj:Evento) => {
  draggedItem.value=obj
}
let timeout: ReturnType<typeof setTimeout> | null = null

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()

  const x = event.clientX

  if (x < 50) {
    if (!timeout) {
      timeout = setTimeout(() => {
        emits('mesMenos')
        timeout = null
      }, 500) // Retraso de 500 milisegundos (0.5 segundos)
    }
  } else if (x > window.innerWidth - 50) {
    if (!timeout) {
      timeout = setTimeout(() => {
        emits('mesMas')
        timeout = null
      }, 500) // Retraso de 500 milisegundos (0.5 segundos)
    }
  } else {
    clearTimeout(timeout!)
    timeout = null
  }
}


const handleDrop = async(fecha:string) => {
  try{
    if(draggedItem.value){
    draggedItem.value.fecha=fecha
    await modificarEvento(draggedItem.value)
    }
  }catch(e){
    console.log(e)
  }
}

</script>

<template>
   <table class="calendar" @dragover="handleDragOver">
    <thead>
      <tr>
        <th v-for="c in cols" :key="c">{{ c }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in props.ROWS" :key="i">
        <td v-for="(c, j) in cols" :key="c">
          <celdaCalendario v-if="tablaMes[i-1][j]"
            :fecha="tablaMes[i-1][j]" 
            @dragover="handleDragOver"
            @drop.prevent="()=>handleDrop(tablaMes[i-1][j])"
            @dragEvento="recogerDrag"
          />
        </td>
      </tr>
    </tbody>
  </table>
 
</template>

<style scoped>
.calendar {
  width: 100%;
  height: 80vh;
  border-collapse: collapse;
}

th {
  border: 1px solid white;
  text-align: center;
  width: auto; /* Establece el ancho automático para que ocupe el mínimo posible */
  font-size: 16px; /* Tamaño de fuente para contenido dentro de las celdas */
  white-space: nowrap; /* Evita que el texto se divida en varias líneas */
  padding: 5px; /* Añade un poco de espacio interno */
  font-weight: bold;
  color: white; /* Color de texto */
  background-color: black;
}

td {
  padding: 0px;
  border: 1px solid black;
  text-align: center;
  width: 14.28%; /* 100% dividido por el número de columnas (7) */
  height: calc(80vh / 6); /* 80% de la altura dividido por el número de filas (6) */
  font-size: 16px; /* Tamaño de fuente para contenido dentro de las celdas */
  background-color: #fff; /* Color de fondo */
  cursor: pointer; /* Cambia el cursor al pasar sobre las celdas */
}

td:hover {
  background-color: #f0f0f0; /* Cambia el color de fondo al pasar el mouse */
}


</style>
