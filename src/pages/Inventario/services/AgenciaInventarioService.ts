import AdministracionInventarioEndPoint from '@/pages/Inventario/services/AdministracionInventarioEndPoint';
import { Agencia, AgenciaFormData } from '@/pages/Inventario/models/agencia.model';
import { request } from '@/utils/AxiosUtils';




export const obtenerAgencias = () =>
    request<Agencia[]>(
        'get',
        AdministracionInventarioEndPoint.OBTENER_TODOS
    );

export const obtenerAgenciaPorId = (id: string) =>
    request<Agencia>(
        'get',
        `${AdministracionInventarioEndPoint.OBTENER_POR_ID}/${id}`
    );

export const obtenerAgenciasPorEmpresa = (
    empresaId: string
) =>
    request<Agencia[]>(
        'get',
        `${AdministracionInventarioEndPoint.OBTENER_POR_EMPRESA}/${empresaId}`
    );

export const crearAgencia = (
    agencia: AgenciaFormData
) =>
    request<Agencia>(
        'post',
        AdministracionInventarioEndPoint.CREAR,
        agencia
    );

export const actualizarAgencia = (
    id: string,
    agencia: AgenciaFormData
) =>
    request<Agencia>(
        'put',
        `${AdministracionInventarioEndPoint.ACTUALIZAR}/${id}`,
        agencia
    );

export const eliminarAgenciaServiceWeb = (id: string) =>
    request<void>(
        'delete',
        `${AdministracionInventarioEndPoint.ELIMINAR}/${id}`
    );