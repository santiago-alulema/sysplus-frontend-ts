import {
    useMemo
} from 'react';

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


import AgenciaFormDialog from '../components/AgenciaFormDialog';
import { useAgencias } from '../hooks/useAgencias';
import { crearAgenciaColumns } from '@/pages/Inventario/configs/agenciaColumns';
import CustomDataGridTs from '@/componentesCommons/CustomDataGridTs';

const AgenciasInventarioPage = () => {
    const {
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
        cargarDatos
    } = useAgencias();

    const columns = useMemo(
        () =>
            crearAgenciaColumns(
                abrirEditar
            ),
        [abrirEditar,]
    );

    return (
        <Box sx={{ p: 2 }}>
            <Stack
                direction={{
                    xs: 'column',
                    sm: 'row'
                }}
                alignItems={{
                    xs: 'stretch',
                    sm: 'center'
                }}
                justifyContent="space-between"
                spacing={1.5}
                mb={2}
            >
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Agencias
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Administración de agencias por empresa
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
                        Nueva agencia
                    </Button>
                </Stack>
            </Stack>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
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
                    gridId="agencias-grid"
                    rows={agencias}
                    columns={columns}
                    getRowId={row => row.id}
                    addNumeration
                    hasFilters
                    hasPagination
                    pageSizes={[5, 10, 20]}
                    initialPageSize={10}
                    titleEmptyTable="No existen agencias registradas"
                    searchLabel="Buscar"
                />
            )}

            <AgenciaFormDialog
                open={formularioAbierto}
                agencia={agenciaSeleccionada}
                empresas={empresas}
                guardando={guardando}
                onClose={cerrarFormulario}
                onGuardar={guardarAgencia}
            />
        </Box>
    );
};

export default AgenciasInventarioPage;