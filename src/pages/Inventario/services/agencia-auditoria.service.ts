

import { request } from '@/utils/AxiosUtils';
import type {
    AgenciaAuditoria,
    AgenciaAuditoriaInDto,
    OpcionInventario
} from '../models/AgenciaAuditoria';
import AgenciaAuditoriaEndPoint from '@/pages/Inventario/services/AgenciaAuditoriaEndPoint';


export const obtenerEmpresas = () => {

    return request<OpcionInventario[]>(
        'get',
        AgenciaAuditoriaEndPoint.OBTENER_EMPRESAS
    );
};


export const obtenerTomasFisicas = (
    empresaId: string
) => {

    return request<OpcionInventario[]>(
        'get',
        `${AgenciaAuditoriaEndPoint.OBTENER_TOMAS_FISICAS}/${empresaId}`
    );
};


export const obtenerEmpleados = (
    empresaId: string
) => {

    return request<OpcionInventario[]>(
        'get',
        `${AgenciaAuditoriaEndPoint.OBTENER_EMPLEADOS}/${empresaId}`
    );
};


export const obtenerAgencias = (
    empresaId: string
) => {

    return request<OpcionInventario[]>(
        'get',
        `${AgenciaAuditoriaEndPoint.OBTENER_AGENCIAS}/${empresaId}`
    );
};


export const obtenerAgenciasAuditoria = (
    empresaId: string,
    tomaFisicaInventarioId: string
) => {

    return request<AgenciaAuditoria[]>(
        'get',
        AgenciaAuditoriaEndPoint.OBTENER_TODOS,
        undefined,
        {
            empresaId,
            tomaFisicaInventarioId
        }
    );
};


export const obtenerAgenciaAuditoriaPorId = (
    id: string
) => {

    return request<AgenciaAuditoria>(
        'get',
        `${AgenciaAuditoriaEndPoint.OBTENER_POR_ID}/${id}`
    );
};


export const crearAgenciaAuditoria = (
    data: AgenciaAuditoriaInDto
) => {

    return request<AgenciaAuditoria>(
        'post',
        AgenciaAuditoriaEndPoint.CREAR,
        data
    );
};


export const actualizarAgenciaAuditoria = (
    id: string,
    data: AgenciaAuditoriaInDto
) => {

    return request<void>(
        'put',
        `${AgenciaAuditoriaEndPoint.ACTUALIZAR}/${id}`,
        data
    );
};


export const eliminarAgenciaAuditoria = (
    id: string
) => {

    return request<void>(
        'delete',
        `${AgenciaAuditoriaEndPoint.ELIMINAR}/${id}`
    );
};