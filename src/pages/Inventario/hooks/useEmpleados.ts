import { EmpleadoInventario, EmpleadoInventarioFormData, EmpresaInventarioOption } from '@/pages/Inventario/models/EmpleadoInventarioModel';
import { actualizarEmpleado, crearEmpleado, eliminarEmpleado, obtenerEmpleados } from '@/pages/Inventario/services/EmpleadoInventarioService';
import { obtenerEmpresas } from '@/pages/Inventario/services/EmpresaInventarioService';
import {
    useCallback,
    useEffect,
    useState
} from 'react';




const obtenerMensajeError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return 'Ocurrió un error inesperado.';
};

export const useEmpleados = () => {
    const [empleados, setEmpleados] = useState<EmpleadoInventario[]>([]);

    const [empresas, setEmpresas] =
        useState<EmpresaInventarioOption[]>([]);

    const [empleadoSeleccionado, setEmpleadoSeleccionado] =
        useState<EmpleadoInventario | null>(null);

    const [formularioAbierto, setFormularioAbierto] =
        useState(false);

    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');

    const cargarDatos = useCallback(async (): Promise<void> => {
        setCargando(true);
        setError('');

        try {
            const [
                empleadosResponse,
                empresasResponse
            ] = await Promise.all([
                obtenerEmpleados(),
                obtenerEmpresas()
            ]);

            setEmpleados(empleadosResponse);
            setEmpresas(empresasResponse);
        } catch (errorResponse: unknown) {
            setError(obtenerMensajeError(errorResponse));
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        void cargarDatos();
    }, [cargarDatos]);

    const abrirNuevo = (): void => {
        setEmpleadoSeleccionado(null);
        setFormularioAbierto(true);
        setError('');
    };

    const abrirEditar = (
        empleado: EmpleadoInventario
    ): void => {
        setEmpleadoSeleccionado(empleado);
        setFormularioAbierto(true);
        setError('');
    };

    const cerrarFormulario = (): void => {
        if (guardando) {
            return;
        }

        setFormularioAbierto(false);
        setEmpleadoSeleccionado(null);
    };

    const guardarEmpleado = async (
        data: EmpleadoInventarioFormData
    ): Promise<void> => {
        setGuardando(true);
        setError('');

        try {
            if (empleadoSeleccionado) {
                await actualizarEmpleado(
                    empleadoSeleccionado.id,
                    data
                );
            } else {
                await crearEmpleado(data);
            }

            setFormularioAbierto(false);
            setEmpleadoSeleccionado(null);

            await cargarDatos();
        } catch (errorResponse: unknown) {
            setError(obtenerMensajeError(errorResponse));
        } finally {
            setGuardando(false);
        }
    };

    const eliminarEmpleadoSeleccionado = async (
        empleado: EmpleadoInventario
    ): Promise<void> => {
        const confirmar = window.confirm(
            `¿Deseas eliminar al empleado "${empleado.nombresApellido}"?`
        );

        if (!confirmar) {
            return;
        }

        setError('');

        try {
            await eliminarEmpleado(empleado.id);
            await cargarDatos();
        } catch (errorResponse: unknown) {
            setError(obtenerMensajeError(errorResponse));
        }
    };

    return {
        empleados,
        empresas,
        empleadoSeleccionado,
        formularioAbierto,
        cargando,
        guardando,
        error,
        abrirNuevo,
        abrirEditar,
        cerrarFormulario,
        guardarEmpleado,
        eliminarEmpleado: eliminarEmpleadoSeleccionado,
        cargarDatos
    };
};