import { request } from "@/utils/AxiosUtils";
import { SobranteInventario } from "../models/SobranteInventario";
import ModificarCodigoInventarioEndPoint from "./ModificarCodigoInventarioEndPoint";

export const obtenerSobrantesInventario = (
    tomaFisicaId: string
) => {
    return request<SobranteInventario[]>(
        'get',
        `${ModificarCodigoInventarioEndPoint.OBTENER_SOBRANTES}?tomaFisicaId=${tomaFisicaId}`
    );
};

export const actualizarCodigoInventario = (
    idItem: string,
    codigoNuevo: string,
    nombreProductoNuevo: string

) => {
    return request<string>(
        'put',
        `${ModificarCodigoInventarioEndPoint.ACTUALIZAR_CODIGO}/${idItem}`,
        {
            codigoNuevo,
            nombreProductoNuevo
        }
    );
};