import {
    useCallback,
    useEffect,
    useState
} from 'react';

import type {
    AgenciaTomaFisicaInventario,
    AgenciaTomaFisicaInventarioFormData,
    EmpresaOption
} from '../models/agenciasTomaFisicaInventario.model';

import {
    actualizarAgenciaTomaFisicaInventario,
    crearAgenciaTomaFisicaInventario,
    eliminarAgenciaTomaFisicaInventario,
    obtenerAgenciasTomaFisicaInventario
} from '@/pages/Inventario/services/AgenciasTomaFisicaInventarioService';

import { obtenerEmpresas }
    from '@/pages/Inventario/services/EmpresaInventarioService';

import { showAlertConfirm }
    from '@/utils/modalAlerts';


const obtenerMensajeError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return 'Ocurrió un error inesperado.';
};


export const useAgenciasTomaFisicaInventario = () => {

    const [agencias, setAgencias] =
        useState<AgenciaTomaFisicaInventario[]>([]);

    const [empresas, setEmpresas] =
        useState<EmpresaOption[]>([]);

    const [agenciaSeleccionada, setAgenciaSeleccionada] =
        useState<AgenciaTomaFisicaInventario | null>(null);

    const [formularioAbierto, setFormularioAbierto] =
        useState(false);

    const [cargando, setCargando] =
        useState(false);

    const [guardando, setGuardando] =
        useState(false);

    const [error, setError] =
        useState('');


    const cargarDatos = useCallback(async (): Promise<void> => {

        setCargando(true);
        setError('');

        try {

            const [
                agenciasResponse,
                empresasResponse
            ] = await Promise.all([
                obtenerAgenciasTomaFisicaInventario(),
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


    const abrirEditar = (
        agencia: AgenciaTomaFisicaInventario
    ): void => {

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
        data: AgenciaTomaFisicaInventarioFormData
    ): Promise<void> => {

        setGuardando(true);
        setError('');

        try {

            if (agenciaSeleccionada) {

                await actualizarAgenciaTomaFisicaInventario(
                    agenciaSeleccionada.id,
                    data
                );

            } else {

                await crearAgenciaTomaFisicaInventario(data);
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
        agencia: AgenciaTomaFisicaInventario
    ): Promise<void> => {

        const confirmar = await showAlertConfirm({
            title: 'Confirmación',
            message: `¿Deseas eliminar la agencia "${agencia.nombre}"?`
        });

        if (!confirmar) {
            return;
        }

        setError('');

        try {

            await eliminarAgenciaTomaFisicaInventario(
                agencia.id
            );

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