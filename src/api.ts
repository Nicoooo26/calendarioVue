import axios from 'axios'
import type { Evento } from '@/interface/interfaces'

// URL base de tu servidor JSON
const baseURL = 'http://localhost:3000'

// Función para obtener eventos por fecha
export async function obtenerEventos(): Promise<Evento[]> {
  try {
    const response = await axios.get<Evento[]>(`${baseURL}/eventos`)
    return response.data
  } catch (error) {
    console.error('Error al obtener eventos:', error)
    return []
  }
}


// Función para crear un nuevo evento
export async function crearEvento(evento: Evento): Promise<void> {
  try {
    await axios.post(`${baseURL}/eventos`, evento)
  } catch (error) {
    console.error('Error al crear un evento:', error)
  }
}

// Función para modificar un evento existente
export async function modificarEvento(eventoModificado: Evento): Promise<void> {
  try {
    await axios.put(`${baseURL}/eventos/${eventoModificado.id}`, eventoModificado)
  } catch (error) {
    console.error('Error al modificar un evento:', error)
  }
}

// Función para eliminar un evento por su ID
export async function eliminarEvento(id: number): Promise<void> {
  try {
    await axios.delete(`${baseURL}/eventos/${id}`)
  } catch (error) {
    console.error('Error al eliminar un evento:', error)
  }
}
