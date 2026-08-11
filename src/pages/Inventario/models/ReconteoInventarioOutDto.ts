import { InventarioCrearOpenBravoOutDto } from "./InventarioCrearOpenBravoOutDto";

export interface ReconteoInventarioOutDto {
    inventarioId: string,
    fechaInicio: string,
    fechaFin: string,
    inventarioOpen:InventarioCrearOpenBravoOutDto[]
}