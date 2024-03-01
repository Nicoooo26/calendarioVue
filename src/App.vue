<script setup lang="ts">
import calendarioMes from './components/calendarioMes.vue'
import { ref ,watch} from 'vue'

const mes = ref<number>(1)
const anio = ref<number>(2024)
const meses: string[] = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const previousMonth = () => {
  mes.value = (mes.value - 1 + 12) % 12 || 12
}

const nextMonth = () => {
  mes.value = (mes.value % 12) + 1
}

const previousYear = () => {
  anio.value--
}

const nextYear = () => {
  anio.value++
}

const selectedOption = ref<string>('all')

const selectedCols = ref<string[]>(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'])

watch(selectedOption, (newValue) => {
  if (newValue === '5days') {
    selectedCols.value = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
  } else {
    selectedCols.value = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  }
})

</script>
<template>
  <div class="container">
    <div class="inputs">
      <div class="select-container">
        <select v-model="selectedOption" class="select-days">
          <option value="all">Todos los días</option>
          <option value="5days">Lunes-Viernes</option>
        </select>
      </div>
      <div class="navigation">
        <button @click="previousYear" class="navigation-button">&lt;&lt;</button>
        <button @click="previousMonth" class="navigation-button">&lt;</button>
        <h2 class="month-year">{{ meses[mes - 1] }} {{ anio }}</h2>
        <button @click="nextMonth" class="navigation-button">&gt;</button>
        <button @click="nextYear" class="navigation-button">&gt;&gt;</button>
      </div>
      <div></div>
    </div>
    <calendarioMes :mes="mes" :anio="anio" :cols="selectedCols" @mesMenos="previousMonth" @mesMas="nextMonth"/>
  </div>
</template>
<style scoped>
.container {
  text-align: center;
  padding: 0px;
  margin-top: 10px;
 
}

.inputs {
  display: grid;
  grid-template-columns: auto auto auto; /* Tres columnas de igual tamaño */
  gap: 200px; 
  padding-bottom: 20px;
  padding-top: 15px;
  border: 1px solid black;
  background-color:darkblue;
  color: white;
}

.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 450px; /* Ajusta el ancho según tu preferencia */
}

.navigation-button {
  background-color: transparent;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 12px 16px;
  font-size: 20px;
}

.month-year {
  font-size: 24px;
  margin: 0;
}

.select-days {
  padding: 8px;
  border-radius: 5px;
  background-color: white;
  color: black;
  font-size: 16px;
  border: 1px solid #ccc;
  outline: none; /* Quita el contorno al seleccionar */
}
.navigation-button:hover {
  background-color: #0056b3;
}
</style>
