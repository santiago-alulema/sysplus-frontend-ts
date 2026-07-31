import { EmpleadoInventario, EmpleadoInventarioFormData } from '@/pages/Inventario/models/EmpleadoInventarioModel';
import EmpleadoInventarioEndPoint from '@/pages/Inventario/services/EmpleadoInventarioEndPoint';
import { request } from '@/utils/AxiosUtils';



export const obtenerEmpleados = () =>
    request<EmpleadoInventario[]>(
        'get',
        EmpleadoInventarioEndPoint.OBTENER_TODOS
    );

export const obtenerEmpleadoPorId = (
    id: string
) =>
    request<EmpleadoInventario>(
        'get',
        `${EmpleadoInventarioEndPoint.OBTENER_POR_ID}/${id}`
    );

export const obtenerEmpleadosPorEmpresa = (
    empresaId: string
) =>
    request<EmpleadoInventario[]>(
        'get',
        `${EmpleadoInventarioEndPoint.OBTENER_POR_EMPRESA}/${empresaId}`
    );

export const crearEmpleado = (
    empleado: EmpleadoInventarioFormData
) =>
    request<EmpleadoInventario>(
        'post',
        EmpleadoInventarioEndPoint.CREAR,
        empleado
    );

export const actualizarEmpleado = (
    id: string,
    empleado: EmpleadoInventarioFormData
) =>
    request<EmpleadoInventario>(
        'put',
        `${EmpleadoInventarioEndPoint.ACTUALIZAR}/${id}`,
        empleado
    );

export const eliminarEmpleado = (
    id: string
) =>
    request<void>(
        'delete',
        `${EmpleadoInventarioEndPoint.ELIMINAR}/${id}`
    );