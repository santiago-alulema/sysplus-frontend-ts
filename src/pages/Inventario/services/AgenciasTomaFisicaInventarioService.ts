import { AgenciaTomaFisicaInventario, AgenciaTomaFisicaInventarioFormData } from '@/pages/Inventario/models/agenciasTomaFisicaInventario.model';
import { AgenciasTomaFisicaInventarioEndPoint } from '@/pages/Inventario/services/AgenciasTomaFisicaInventarioEndPoint';

import { request }
    from '@/utils/AxiosUtils';


export const obtenerAgenciasTomaFisicaInventario = () =>
    request<AgenciaTomaFisicaInventario[]>(
        'get',
        AgenciasTomaFisicaInventarioEndPoint.OBTENER_TODOS
    );


export const obtenerAgenciaTomaFisicaInventarioPorId = (
    id: string
) =>
    request<AgenciaTomaFisicaInventario>(
        'get',
        `${AgenciasTomaFisicaInventarioEndPoint.OBTENER_POR_ID}/${id}`
    );


export const obtenerAgenciasTomaFisicaInventarioPorEmpresa = (
    empresaId: string
) =>
    request<AgenciaTomaFisicaInventario[]>(
        'get',
        `${AgenciasTomaFisicaInventarioEndPoint.OBTENER_POR_EMPRESA}/${empresaId}`
    );


export const crearAgenciaTomaFisicaInventario = (
    agencia: AgenciaTomaFisicaInventarioFormData
) =>
    request<AgenciaTomaFisicaInventario>(
        'post',
        AgenciasTomaFisicaInventarioEndPoint.CREAR,
        agencia
    );


export const actualizarAgenciaTomaFisicaInventario = (
    id: string,
    agencia: AgenciaTomaFisicaInventarioFormData
) =>
    request<AgenciaTomaFisicaInventario>(
        'put',
        `${AgenciasTomaFisicaInventarioEndPoint.ACTUALIZAR}/${id}`,
        agencia
    );


export const eliminarAgenciaTomaFisicaInventario = (
    id: string
) =>
    request<void>(
        'delete',
        `${AgenciasTomaFisicaInventarioEndPoint.ELIMINAR}/${id}`
    );