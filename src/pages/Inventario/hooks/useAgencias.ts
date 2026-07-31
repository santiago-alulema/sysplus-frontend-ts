import {
    useCallback,
    useEffect,
    useState
} from 'react';


import type {
    Agencia,
    AgenciaFormData,
    EmpresaOption
} from '../models/agencia.model';
import { actualizarAgencia, crearAgencia, eliminarAgenciaServiceWeb, obtenerAgencias } from '@/pages/Inventario/services/AgenciaInventarioService';
import { obtenerEmpresas } from '@/pages/Inventario/services/EmpresaInventarioService';
import { showAlertConfirm } from '@/utils/modalAlerts';

const obtenerMensajeError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return 'Ocurrió un error inesperado.';
};

export const useAgencias = () => {
    const [agencias, setAgencias] = useState<Agencia[]>([]);
    const [empresas, setEmpresas] = useState<EmpresaOption[]>([]);

    const [agenciaSeleccionada, setAgenciaSeleccionada] =
        useState<Agencia | null>(null);

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
                agenciasResponse,
                empresasResponse
            ] = await Promise.all([
                obtenerAgencias(),
                obtenerEmpresas()
            ]);

            setAgencias(agenciasResponse);
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
        setAgenciaSeleccionada(null);
        setFormularioAbierto(true);
        setError('');
    };

    const abrirEditar = (agencia: Agencia): void => {
        setAgenciaSeleccionada(agencia);
        setFormularioAbierto(true);
        setError('');
    };

    const cerrarFormulario = (): void => {
        if (guardando) {
            return;
        }

        setFormularioAbierto(false);
        setAgenciaSeleccionada(null);
    };

    const guardarAgencia = async (
        data: AgenciaFormData
    ): Promise<void> => {
        setGuardando(true);
        setError('');

        try {
            if (agenciaSeleccionada) {
                await actualizarAgencia(
                    agenciaSeleccionada.id,
                    data
                );
            } else {
                await crearAgencia(data);
            }

            setFormularioAbierto(false);
            setAgenciaSeleccionada(null);

            await cargarDatos();
        } catch (errorResponse: unknown) {
            setError(obtenerMensajeError(errorResponse));
        } finally {
            setGuardando(false);
        }
    };

    const eliminarAgencia = async (
        agencia: Agencia
    ): Promise<void> => {


        const confirmar = await showAlertConfirm({
            title: "Confirmacion",
            message: `¿Deseas eliminar la agencia "${agencia.nombre}"?`
        })

        if (!confirmar) {
            return;
        }

        setError('');

        try {
            await eliminarAgenciaServiceWeb(agencia.id);
            await cargarDatos();
        } catch (errorResponse: unknown) {
            setError(obtenerMensajeError(errorResponse));
        }
    };

    return {
        agencias,
        empresas,
        agenciaSeleccionada,
        formularioAbierto,
        cargando,
        guardando,
        error,
        abrirNuevo,
        abrirEditar,
        cerrarFormulario,
        guardarAgencia,
        eliminarAgencia,
        cargarDatos
    };
};