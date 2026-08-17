import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    Typography
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import {
    useEffect,
    useState
} from 'react';

import type {
    AgenciaAuditoria,
    OpcionInventario
} from '../models/AgenciaAuditoria';
import { eliminarAgenciaAuditoria, obtenerAgencias, obtenerAgenciasAuditoria, obtenerEmpleados, obtenerEmpresas, obtenerTomasFisicas } from '@/pages/Inventario/services/agencia-auditoria.service';
import { showAlert } from '@/utils/modalAlerts';
import AgenciaAuditoriaFiltros from '@/pages/Inventario/components/AgenciaAuditoriaFiltros';
import AgenciaAuditoriaFormModal from '@/pages/Inventario/components/AgenciaAuditoriaFormModal';
import AgenciaAuditoriaTabla from '@/pages/Inventario/models/AgenciaAuditoriaTabla';




const AgenciaAuditoriaPage = () => {

    const [empresas, setEmpresas] =
        useState<OpcionInventario[]>([]);

    const [tomasFisicas, setTomasFisicas] =
        useState<OpcionInventario[]>([]);

    const [empleados, setEmpleados] =
        useState<OpcionInventario[]>([]);

    const [agencias, setAgencias] =
        useState<OpcionInventario[]>([]);

    const [registros, setRegistros] =
        useState<AgenciaAuditoria[]>([]);


    const [empresaId, setEmpresaId] =
        useState('');

    const [
        tomaFisicaInventarioId,
        setTomaFisicaInventarioId
    ] = useState('');


    const [cargando, setCargando] =
        useState(false);

    const [modalAbierto, setModalAbierto] =
        useState(false);

    const [registroEditar, setRegistroEditar] =
        useState<AgenciaAuditoria | null>(null);


    useEffect(() => {

        cargarEmpresas();

    }, []);


    const cargarEmpresas = async () => {

        try {

            const response = await obtenerEmpresas();

            setEmpresas(response);

        } catch {
            // El interceptor de axios ya muestra el error.
        }
    };


    const cambiarEmpresa = async (
        empresa: OpcionInventario | null
    ) => {

        const id = empresa?.id ?? '';

        setEmpresaId(id);
        setTomaFisicaInventarioId('');

        setTomasFisicas([]);
        setEmpleados([]);
        setAgencias([]);
        setRegistros([]);


        if (!id)
            return;


        try {

            const [
                tomasResponse,
                empleadosResponse,
                agenciasResponse
            ] = await Promise.all([
                obtenerTomasFisicas(id),
                obtenerEmpleados(id),
                obtenerAgencias(id)
            ]);

            setTomasFisicas(tomasResponse);
            setEmpleados(empleadosResponse);
            setAgencias(agenciasResponse);

        } catch {
            // El interceptor ya muestra el error.
        }
    };


    const cambiarTomaFisica = async (
        tomaFisica: OpcionInventario | null
    ) => {

        const id = tomaFisica?.id ?? '';

        setTomaFisicaInventarioId(id);
        setRegistros([]);


        if (!empresaId || !id)
            return;


        await cargarRegistros(
            empresaId,
            id
        );
    };


    const cargarRegistros = async (
        empresa: string = empresaId,
        tomaFisica: string = tomaFisicaInventarioId
    ) => {

        if (!empresa || !tomaFisica)
            return;


        setCargando(true);

        try {

            const response =
                await obtenerAgenciasAuditoria(
                    empresa,
                    tomaFisica
                );

            setRegistros(response);

        } catch {
            // El interceptor ya muestra el error.
        } finally {

            setCargando(false);
        }
    };


    const abrirNuevo = () => {

        if (!empresaId || !tomaFisicaInventarioId)
            return;

        setRegistroEditar(null);

        setModalAbierto(true);
    };


    const abrirEditar = (
        registro: AgenciaAuditoria
    ) => {

        setRegistroEditar(registro);

        setModalAbierto(true);
    };


    const cerrarModal = () => {

        setModalAbierto(false);

        setRegistroEditar(null);
    };


    const eliminar = async (
        registro: AgenciaAuditoria
    ) => {

        const confirmar = window.confirm(
            `¿Está seguro de eliminar la asignación de  'este empleado'
            }?`
        );

        if (!confirmar)
            return;


        try {

            await eliminarAgenciaAuditoria(
                registro.id
            );


            showAlert({
                title: 'Correcto',
                message: 'Asignación eliminada correctamente.',
                type: 'success',
                callBackFunction: false
            });


            await cargarRegistros();

        } catch {
            // El interceptor ya muestra el error.
        }
    };


    return (

        <Box sx={{ p: 2 }}>

            <Stack spacing={2}>


                {/* TÍTULO */}

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Administración de agencias
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Asignación de empleados a agencias
                        para la toma física de inventario
                    </Typography>

                </Box>


                {/* EMPRESA Y TOMA FÍSICA */}

                <AgenciaAuditoriaFiltros
                    empresas={empresas}
                    tomasFisicas={tomasFisicas}
                    empresaId={empresaId}
                    tomaFisicaInventarioId={
                        tomaFisicaInventarioId
                    }
                    onEmpresaChange={
                        cambiarEmpresa
                    }
                    onTomaFisicaChange={
                        cambiarTomaFisica
                    }
                />


                {/* TABLA */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderRadius: 2
                    }}
                >

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
                        spacing={2}
                        mb={2}
                    >

                        <Box>

                            <Typography
                                variant="h6"
                                fontWeight={600}
                            >
                                Asignaciones
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Empleados asignados a las agencias
                            </Typography>

                        </Box>


                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            disabled={
                                !empresaId ||
                                !tomaFisicaInventarioId
                            }
                            onClick={abrirNuevo}
                        >
                            Nueva asignación
                        </Button>

                    </Stack>


                    {cargando ? (

                        <Box
                            sx={{
                                minHeight: 250,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <CircularProgress
                                size={32}
                            />
                        </Box>

                    ) : (

                        <AgenciaAuditoriaTabla
                            registros={registros}
                            onEditar={abrirEditar}
                            onEliminar={eliminar}
                        />

                    )}

                </Paper>

            </Stack>


            {/* CREAR / EDITAR */}

            <AgenciaAuditoriaFormModal
                open={modalAbierto}
                registro={registroEditar}
                empresaId={empresaId}
                tomaFisicaInventarioId={
                    tomaFisicaInventarioId
                }
                empleados={empleados}
                agencias={agencias}
                onClose={cerrarModal}
                onGuardado={cargarRegistros}
            />

        </Box>
    );
};


export default AgenciaAuditoriaPage;