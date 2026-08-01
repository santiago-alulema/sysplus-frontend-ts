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
import TomaFisicaInventarioFormDialog
    from '../components/TomaFisicaInventarioFormDialog';
import {
    useTomasFisicasInventario
} from '../hooks/useTomasFisicasInventario';
import { crearTomaFisicaInventarioColumns } from '@/pages/Inventario/configs/TomaFisicaInventarioColumns';
import CustomDataGridTs from '@/componentesCommons/CustomDataGridTs';

const TomaFisicaInventarioPage = () => {
    const {
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
        cargarDatos
    } = useTomasFisicasInventario();

    const columns = crearTomaFisicaInventarioColumns(
        abrirEditar,
    );

    return (
        <Box sx={{ p: 2 }}>
            <Stack
                direction={{
                    xs: 'column',
                    sm: 'row'
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: 'stretch',
                    sm: 'center'
                }}
                spacing={1.5}
                mb={2}
            >
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Tomas físicas de inventario
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Administración de procesos de inventario
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
                        Nueva toma física
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
                    gridId="tomas-fisicas-inventario-grid"
                    rows={tomasFisicas}
                    columns={columns}
                    getRowId={row => row.id}
                    addNumeration
                    hasFilters
                    hasPagination
                    pageSizes={[5, 10, 20]}
                    initialPageSize={10}
                    searchLabel="Buscar"
                    titleEmptyTable="No existen tomas físicas registradas"
                />
            )}

            <TomaFisicaInventarioFormDialog
                open={formularioAbierto}
                tomaFisica={tomaFisicaSeleccionada}
                empresas={empresas}
                guardando={guardando}
                onClose={cerrarFormulario}
                onGuardar={guardarTomaFisica}
            />
        </Box>
    );
};

export default TomaFisicaInventarioPage;