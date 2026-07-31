export interface ProgresoInventarioOutDto {
  nombreInventario: string;
  data: ProgresoFecha[];
}

export interface ProgresoFecha {
  fecha: string;
  progresoGrupo: ProgresoGrupo[];
}

export interface ProgresoGrupo {
  nombreResponsable: string;
  totalACumplir: number;
  totalCumplido: number;
  agencia: string;
}