import { request } from '@/utils/AxiosUtils';

import type {
    AgenciaMatriculacionOption,
    ValorMatriculacion,
    ValorMatriculacionFormData
} from '../models/valorMatriculacion.model';

import ValoresMatriculacionEndPoint from './ValoresMatriculacionEndPoint';

export const obtenerValoresMatriculacion = () =>
    request<ValorMatriculacion[]>(
        'get',
        ValoresMatriculacionEndPoint.OBTENER_TODOS
    );

export const obtenerAgenciasMatriculacion = () =>
    request<AgenciaMatriculacionOption[]>(
        'get',
        ValoresMatriculacionEndPoint.OBTENER_AGENCIAS
    );

export const crearValorMatriculacion = (
    data: ValorMatriculacionFormData
) =>
    request<string>(
        'post',
        ValoresMatriculacionEndPoint.CREAR,
        data
    );

export const actualizarValorMatriculacion = (
    id: string,
    data: ValorMatriculacionFormData
) =>
    request<void>(
        'put',
        `${ValoresMatriculacionEndPoint.ACTUALIZAR}/${id}`,
        data
    );

export const eliminarValorMatriculacion = (id: string) =>
    request<void>(
        'delete',
        `${ValoresMatriculacionEndPoint.ELIMINAR}/${id}`
    );
