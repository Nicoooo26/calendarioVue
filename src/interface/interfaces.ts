export interface Evento {
    id: number;
    fecha: string;
    titulo: string;
    descripcion: string;
  }

export interface calendarioTabla{
    mes?:number
    anio?:number
    cols?:string[]
    COLS?:number
    ROWS?:number
}