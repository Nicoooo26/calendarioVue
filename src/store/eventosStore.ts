import { defineStore } from 'pinia'
import type { Evento } from '@/interface/interfaces'

export const useEventosStore = defineStore('eventos',{
  state: () => ({
    eventos: [] as Evento[],
  }),
  getters: {
    eventosPorFecha: (state) => (fecha: string) => {
      return state.eventos.filter((evento) => evento.fecha === fecha)
    }
  }
})
