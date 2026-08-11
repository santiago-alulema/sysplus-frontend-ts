import {
    useCallback,
    useEffect,
    useState
} from 'react';

import {
    actualizarTomaFisicaInventario,
    crearTomaFisicaInventario,
    eliminarTomaFisicaInventario,
    obtenerTomasFisicasInventario
} from '../services/TomaFisicaInventarioService';


import type {
    EmpresaOption,
    TomaFisicaInventario,
    TomaFisicaInventarioFormData
} from '../models/TomaFisicaInventarioModel';
import { obtenerEmpresas } from '@/pages/Inventario/services/EmpresaInventarioService';

const obtenerMensajeError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return 'Ocurrió un error inesperado.';
};

export const useTomasFisicasInventario = () => {
    const [tomasFisicas, setTomasFisicas] =useState<TomaFisicaInventario[]>([]);
    const [empresas, setEmpresas] =useState<EmpresaOption[]>([]);
    const [tomaFisicaSeleccionada,setTomaFisicaSeleccionada] = useState<TomaFisicaInventario | null>(null);
    const [formularioAbierto, setFormularioAbierto] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [abrirModalSubidaInventario, setAbrirModalSubidaInventario] = useState(false);
    const [abrirModalSubirReconteo, setAbrirModalSubirReconteo] = useState(false);


    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');

    const cargarDatos = useCallback(async (): Promise<void> => {
        setCargando(true);
        setError('');

        try {
            const [
                tomasFisicasResponse,
                empresasResponse
            ] = await Promise.all([
                obtenerTomasFisicasInventario(),
                obtenerEmpresas()
            ]);

            setTomasFisicas(tomasFisicasResponse);
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
        setTomaFisicaSeleccionada(null);
        setFormularioAbierto(true);
        setError('');
    };

    const abrirEditar = (tomaFisica: TomaFisicaInventario): void => {
        setTomaFisicaSeleccionada(tomaFisica);
        setFormularioAbierto(true);
        setError('');
    };

    const abrirSubirInventario = (tomaFisica: TomaFisicaInventario): void => {
        setTomaFisicaSeleccionada(tomaFisica);
        setAbrirModalSubidaInventario(true);
        setError('');
    };

    const abrirSubirReconteo = (tomaFisica: TomaFisicaInventario): void => {
        setTomaFisicaSeleccionada(tomaFisica);
        setAbrirModalSubirReconteo(true);
        setError('');
    };


    const cerrarFormulario = (): void => {
        if (guardando) {
            return;
        }

        setFormularioAbierto(false);
        setTomaFisicaSeleccionada(null);
    };

    const guardarTomaFisica = async (
        data: TomaFisicaInventarioFormData
    ): Promise<void> => {
        setGuardando(true);
        setError('');

        try {
            if (tomaFisicaSeleccionada) {
                await actualizarTomaFisicaInventario(
                    tomaFisicaSeleccionada.empresaId,
                    tomaFisicaSeleccionada.id,
                    {
                        nombre: data.nombre,
                        estatus: data.estatus,
                        fechaInicio: data.fechaInicio,
                        fechaFin: data.fechaFin
                    }
                );
            } else {
                await crearTomaFisicaInventario(data);
            }

            setFormularioAbierto(false);
            setTomaFisicaSeleccionada(null);

            await cargarDatos();
        } catch (errorResponse: unknown) {
            setError(obtenerMensajeError(errorResponse));
        } finally {
            setGuardando(false);
        }
    };

    const eliminarTomaFisica = async (
        tomaFisica: TomaFisicaInventario
    ): Promise<void> => {
        const confirmar = window.confirm(
            `¿Deseas eliminar la toma física "${tomaFisica.nombre}"?`
        );

        if (!confirmar) {
            return;
        }

        setError('');

        try {
            await eliminarTomaFisicaInventario(
                tomaFisica.empresaId,
                tomaFisica.id
            );

            await cargarDatos();
        } catch (errorResponse: unknown) {
            setError(obtenerMensajeError(errorResponse));
        }
    };

    return {
        tomasFisicas,
        empresas,
        tomaFisicaSeleccionada,
        formularioAbierto,
        cargando,
        guardando,
        error,
        abrirNuevo,
        abrirEditar,
        cerrarFormulario,
        guardarTomaFisica,
        eliminarTomaFisica,
        cargarDatos,
        abrirModalSubidaInventario, 
        setAbrirModalSubidaInventario,
        abrirSubirInventario,
        abrirModalSubirReconteo, 
        setAbrirModalSubirReconteo,
        abrirSubirReconteo
    };
};