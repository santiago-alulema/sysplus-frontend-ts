import { request } from "@/utils/AxiosUtils";
import { ProgresoInventarioOutDto } from "../models/reporte-progreso.model";
import { ProgresoInventarioEndPoint } from "./ProgresoInventarioEndPoint";

export const obtenerReporteProgresoServicioWeb = (empresaId: string, tomaFisicaId: string) =>
    request<ProgresoInventarioOutDto>(
        'get',
        `${ProgresoInventarioEndPoint.OBTENENER_REPORTES}/${empresaId}/${tomaFisicaId}`
    );