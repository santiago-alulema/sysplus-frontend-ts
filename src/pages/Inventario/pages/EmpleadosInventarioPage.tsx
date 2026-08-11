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


import EmpleadoFormDialog
    from '../components/EmpleadoFormDialog';

import {
    useEmpleados
} from '../hooks/useEmpleados';
import { crearEmpleadoColumns } from '@/pages/Inventario/configs/EmpleadoInventarioColumns';
import CustomDataGridTs from '@/componentesCommons/DataGridCommon/CustomDataGridTs';

const EmpleadosInventarioPage = () => {
    const {
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
        cargarDatos
    } = useEmpleados();

    const columns = crearEmpleadoColumns(
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
                        Empleados
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Administración de empleados por empresa
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
                        Nuevo empleado
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
                    gridId="empleados-grid"
                    rows={empleados}
                    columns={columns}
                    getRowId={row => row.id}
                    addNumeration
                    hasFilters
                    hasPagination
                    pageSizes={[5, 10, 20]}
                    initialPageSize={10}
                    searchLabel="Buscar"
                    titleEmptyTable="No existen empleados registrados"
                />
            )}

            <EmpleadoFormDialog
                open={formularioAbierto}
                empleado={empleadoSeleccionado}
                empresas={empresas}
                guardando={guardando}
                onClose={cerrarFormulario}
                onGuardar={guardarEmpleado}
            />
        </Box>
    );
};

export default EmpleadosInventarioPage;