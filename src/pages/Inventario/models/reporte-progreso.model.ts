export interface ProgresoInventarioOutDto {
  nombreInventario: string;
  totalRegistrosContado: number;
  totalRegistrosOpen: number;
  totalRegistroPorcentaje: number;
  totalCantidadContada: number;
  totalCantidadOpen: number;
  totalPorcentajeCantitad: number;

  data: ProgresoFecha[];
}

export interface ProgresoFecha {
  fecha: string;
  totalContadoPorDia: number;
  progresoGrupo: ProgresoGrupo[];
}

export interface ProgresoGrupo {
  nombreResponsable: string;
  totalACumplir: number;
  totalCumplido: number;
  agencia: string;
}