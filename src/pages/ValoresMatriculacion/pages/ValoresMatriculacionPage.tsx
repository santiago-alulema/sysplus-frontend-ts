import { useCallback, useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography
} from '@mui/material';

import CustomDataGridTs from '@/componentesCommons/DataGridCommon/CustomDataGridTs';

import ValorMatriculacionFormDialog from '../components/ValorMatriculacionFormDialog';
import { crearValoresMatriculacionColumns } from '../configs/valorMatriculacionColumns';

import type {
    AgenciaMatriculacionOption,
    ValorMatriculacion,
    ValorMatriculacionFormData
} from '../models/valorMatriculacion.model';

import {
    actualizarValorMatriculacion,
    crearValorMatriculacion,
    eliminarValorMatriculacion,
    obtenerAgenciasMatriculacion,
    obtenerValoresMatriculacion
} from '../services/ValoresMatriculacionServiceWeb';
import { useLoading } from '@/componentesCommons/LoadingContext';
import { showAlertConfirm } from '@/utils/modalAlerts';

const ValoresMatriculacionPage = () => {
    const [valores, setValores] = useState<ValorMatriculacion[]>([]);
    const [agencias, setAgencias] = useState<AgenciaMatriculacionOption[]>([]);
    const [seleccionado, setSeleccionado] = useState<ValorMatriculacion | null>(null);
    const [formularioAbierto, setFormularioAbierto] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const {stopLoading, startLoading} = useLoading();

    const cargarDatos = useCallback(async () => {
        try {
            startLoading();
            setError('');

            const [valoresRespuesta, agenciasRespuesta] =
                await Promise.all([
                    obtenerValoresMatriculacion(),
                    obtenerAgenciasMatriculacion()
                ]);

            setValores(valoresRespuesta);
            setAgencias(agenciasRespuesta);
        } finally {
            stopLoading();
        }
    }, []);

    useEffect(() => {
        void cargarDatos();
    }, [cargarDatos]);

    const abrirNuevo = () => {
        setSeleccionado(null);
        setFormularioAbierto(true);
    };

    const abrirEditar = (valor: ValorMatriculacion) => {
        setSeleccionado(valor);
        setFormularioAbierto(true);
    };

    const cerrarFormulario = () => {
        if (guardando)
            return;

        setFormularioAbierto(false);
        setSeleccionado(null);
    };

    const guardar = async (data: ValorMatriculacionFormData) => {
        try {
            setGuardando(true);

            if (seleccionado) {
                await actualizarValorMatriculacion(
                    seleccionado.id,
                    data
                );
            } else {
                await crearValorMatriculacion(data);
            }

            setFormularioAbierto(false);
            setSeleccionado(null);
            await cargarDatos();
        } finally {
            setGuardando(false);
        }
    };

    const eliminar = async (valor: ValorMatriculacion) => {
        const confirmar = await showAlertConfirm({
                        message: `¿Eliminar la agencia ${valor.agenciaNombre ?? ''} del usuario ${valor.username}?`,
                        title: "Eliminar",
                        type: "warning"
                    });

        if (!confirmar)
            return;

        await eliminarValorMatriculacion(valor.id);
        await cargarDatos();
    };

    const columns = crearValoresMatriculacionColumns(
        abrirEditar,
        eliminar
    );

    return (
        <Box sx={{ p: 2 }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
                spacing={1.5}
                mb={2}
            >
                <Box>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    > Un usuario puede tener varias agencias, pero una sola agencia destino.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => void cargarDatos()}
                        disabled={cargando}
                    >
                        Actualizar
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={abrirNuevo}
                    >
                        Nuevo registro
                    </Button>
                </Stack>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {cargando ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    py={6}
                >
                    <CircularProgress size={32} />
                </Box>
            ) : (
                <CustomDataGridTs
                    gridId="valores-matriculacion-grid"
                    rows={valores}
                    columns={columns}
                    getRowId={row => row.id}
                    addNumeration
                    hasFilters
                    hasPagination
                    pageSizes={[10, 20, 50]}
                    initialPageSize={10}
                    titleEmptyTable="No existen valores de matriculación registrados"
                    searchLabel="Buscar"
                />
            )}

            <ValorMatriculacionFormDialog
                open={formularioAbierto}
                valor={seleccionado}
                agencias={agencias}
                guardando={guardando}
                onClose={cerrarFormulario}
                onGuardar={guardar}
            />
        </Box>
    );
};

export default ValoresMatriculacionPage;
