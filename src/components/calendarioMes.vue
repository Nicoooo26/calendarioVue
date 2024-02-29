<script setup lang="ts">
import {computed,ref } from 'vue'
import celdaCalendario from '@/components/celdaCalendario.vue'
import { modificarEvento } from '@/api';
import type { Evento,calendarioTabla } from '@/interface/interfaces'


const props = withDefaults(defineProps<calendarioTabla>(),{
            cols: ()=> ['Lunes', 'Martes', 'Miércoles', 'Jueves','Viernes','Sábado', 'Domingo'],
            COLS: 7,
            ROWS: 6,
            anio: 2000,
            mes: 1


})

//Convertimos el número de orden del día en filas y columnas
const anadevalorSecuencial = (numero: number, valor: string, celdas: string[][]) => {
    const fila = Math.floor(numero / props.COLS);
    const columna = numero % props.COLS;
    celdas[fila][columna] = valor;
}

const tablaMes = computed(() =>{
  const celdas: string[][] = Array.from(Array(props.COLS).keys()).map(() =>
                        Array.from(Array(props.ROWS).keys()).map(() => ''))
  const primerDia = new Date(`${props.anio}-${props.mes}-1`)
  const posicionPrimerDia = [6,0,1,2,3,4,5][primerDia.getDay()]
  const numDiasMes = new Date(props.anio, props.mes, 0).getDate()
  const rangoNumeros = [...Array(numDiasMes).keys()].map(i => i + posicionPrimerDia )
  // Recorremos el rango de números para añadir la fecha
  rangoNumeros.map((el,ind)=> {
    const day = (ind + 1).toString().padStart(2, '0'); // Agrega cero a la izquierda si es necesario
    const fecha = `${props.anio}-${props.mes.toString().padStart(2, '0')}-${day}`; // Formatea el mes y el día
    anadevalorSecuencial(el, fecha, celdas);
  });
  return celdas;
});

const draggedItem = ref<Evento>()

const recogerDrag = (obj:Evento) => {
  draggedItem.value=obj
}
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
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
   <table class="calendar">
    <thead>
      <tr>
        <th v-for="c in cols" :key="c">{{ c }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in props.ROWS" :key="i">
        <td v-for="(c, j) in cols" :key="c">
          <celdaCalendario v-if="tablaMes[i-1][j]!=undefined"
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
