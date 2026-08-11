import { request } from '@/utils/AxiosUtils';

import type {
    TomaFisicaInventario,
    TomaFisicaInventarioFormData
} from '../models/TomaFisicaInventarioModel';

import TomaFisicaInventarioEndPoint
    from './TomaFisicaInventarioEndPoint';
import { InventarioCrearOpenBravoOutDto } from '../models/InventarioCrearOpenBravoOutDto';
import { ReconteoInventarioOutDto } from '../models/ReconteoInventarioOutDto';

export const obtenerTomasFisicasInventario = () =>
    request<TomaFisicaInventario[]>(
        'get',
        TomaFisicaInventarioEndPoint.OBTENER_TODOS
    );

export const obtenerTomasFisicasPorEmpresa = (
    empresaId: string
) =>
    request<TomaFisicaInventario[]>(
        'get',
        `${TomaFisicaInventarioEndPoint.OBTENER_POR_EMPRESA}/${empresaId}`
    );

export const obtenerTomaFisicaPorId = (
    empresaId: string,
    id: string
) =>
    request<TomaFisicaInventario>(
        'get',
        `${TomaFisicaInventarioEndPoint.OBTENER_POR_ID}/${empresaId}/${id}`
    );

export const crearTomaFisicaInventario = (data: TomaFisicaInventarioFormData) =>
    request<TomaFisicaInventario>(
        'post',
        TomaFisicaInventarioEndPoint.CREAR,
        data
    );

export const actualizarTomaFisicaInventario = (
    empresaId: string,
    id: string,
    data: Omit<TomaFisicaInventarioFormData, 'empresaId'>
) =>
    request<TomaFisicaInventario>(
        'put',
        `${TomaFisicaInventarioEndPoint.ACTUALIZAR}/${empresaId}/${id}`,
        data
    );

export const eliminarTomaFisicaInventario = (
    empresaId: string,
    id: string
) =>request<void>(
        'delete',
        `${TomaFisicaInventarioEndPoint.ELIMINAR}/${empresaId}/${id}`
    );



export const grabarNuevoInventarioServicioWeb = (inventarioNuevo: InventarioCrearOpenBravoOutDto[]) =>
    request<string>(
        'post',
        `${TomaFisicaInventarioEndPoint.SUBIR_TOMA_FISICA_BASE_CONOCIMIENTOS}`,
        inventarioNuevo
    );

    export const grabarReconteoOpenBravoServicioWeb = (inventarioNuevo: ReconteoInventarioOutDto) =>
    request<string>(
        'post',
        `${TomaFisicaInventarioEndPoint.SUBIR_RECONTEO_INVENTARIO}`,
        inventarioNuevo
    );