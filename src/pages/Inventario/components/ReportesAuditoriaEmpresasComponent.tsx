import {
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';

import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

import { useEffect, useState } from 'react';

import type { OpcionInventario } from '../models/AgenciaAuditoria';

import {
    obtenerEmpresas,
    obtenerTomasFisicas
} from '../services/agencia-auditoria.service';

import {
    descargarReporteCortesServicioWeb,
    descargarReporteDiarioServicioWeb,
    descargarReporteFinalExcelServicioWeb,
    descargarReporteFinalPdfServicioWeb
} from '@/pages/Inventario/services/ReportesServiciosWeb';

import { useLoading } from '@/componentesCommons/LoadingContext';
import { showAlert } from '@/utils/modalAlerts';


const ReportesAuditoriaEmpresasComponent = () => {

    const [empresas, setEmpresas] = useState<OpcionInventario[]>([]);
    const [tomasFisicas, setTomasFisicas] = useState<OpcionInventario[]>([]);

    const [empresaId, setEmpresaId] = useState('');
    const [tomaFisicaInventarioId, setTomaFisicaInventarioId] = useState('');

    const [cargandoTomas, setCargandoTomas] = useState(false);

    const { startLoading, stopLoading } = useLoading();


    useEffect(() => {
        obtenerEmpresas().then(setEmpresas);
    }, []);


    const cambiarEmpresa = async (
        empresa: OpcionInventario | null
    ) => {

        const id = empresa?.id ?? '';

        setEmpresaId(id);
        setTomaFisicaInventarioId('');
        setTomasFisicas([]);

        if (!id)
            return;

        setCargandoTomas(true);

        try {
            const response = await obtenerTomasFisicas(id);
            setTomasFisicas(response);
        }
        finally {
            setCargandoTomas(false);
        }
    };


    const reporteDiarioConCorte = async () => {

        const ahora = new Date();

        const horaActual =
            ahora.getHours() * 60 +
            ahora.getMinutes();

        let corte: number;

        if (
            horaActual >= 8 * 60 &&
            horaActual <= 14 * 60
        ) {
            corte = 1;
        }
        else if (
            horaActual >= (14 * 60) + 1 &&
            horaActual <= 19 * 60
        ) {
            corte = 2;
        }
        else {

            showAlert({
                title: "Advertencia",
                type: "warning",
                message: "Fuera del horario de cortes."
            });

            return false;
        }

        await descargarReporteCortesServicioWeb(
            empresaId,
            tomaFisicaInventarioId,
            corte
        );

        return true;
    };


    /*
     * CONFIGURACIÓN DE REPORTES
     *
     * Para agregar otro reporte solamente
     * tienes que agregar otro objeto.
     */
    const reportes = [
        {
            titulo: 'Reporte diario por corte',
            descripcion: 'Genera el reporte correspondiente al corte actual.',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',
            servicio: reporteDiarioConCorte
        },
        {
            titulo: 'Reporte diario responsables',
            descripcion: 'Detalle diario de responsables de toma física.',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',
            servicio: () =>
                descargarReporteDiarioServicioWeb(
                    empresaId,
                    tomaFisicaInventarioId
                )
        },
        {
            titulo: 'Reporte final',
            descripcion: 'Reporte consolidado final del inventario.',
            formato: 'EXCEL',
            icono: <TableViewOutlinedIcon />,
            color: '#2e7d32',
            fondo: '#f3faf4',
            servicio: () =>
                descargarReporteFinalExcelServicioWeb(
                    empresaId,
                    tomaFisicaInventarioId
                )
        },
        {
            titulo: 'Reporte final',
            descripcion: 'Reporte consolidado final del inventario.',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',
            servicio: () =>
                descargarReporteFinalPdfServicioWeb(
                    empresaId,
                    tomaFisicaInventarioId
                )
        },
        {
            titulo: 'Reporte diario',
            descripcion: 'Reporte general diario de la toma física.',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',

            // Actualmente en tu código utiliza este servicio.
            servicio: () =>
                descargarReporteFinalPdfServicioWeb(
                    empresaId,
                    tomaFisicaInventarioId
                )
        },
        {
            titulo: 'Reporte diario',
            descripcion: 'Reporte general diario de la toma física.',
            formato: 'EXCEL',
            icono: <TableViewOutlinedIcon />,
            color: '#2e7d32',
            fondo: '#f3faf4',

            // Actualmente en tu código utiliza este servicio.
            servicio: () =>
                descargarReporteFinalExcelServicioWeb(
                    empresaId,
                    tomaFisicaInventarioId
                )
        }
    ];


    const ejecutarReporte = async (
        servicio: () => Promise<any>
    ) => {

        startLoading();

        try {

            const resultado = await servicio();

            if (resultado === false)
                return;

            showAlert({
                title: 'Correcto',
                type: 'success',
                message: 'El reporte se descargó correctamente.'
            });

        }
        catch {

            showAlert({
                title: 'Error',
                type: 'error',
                message: 'No se pudo generar el reporte.'
            });

        }
        finally {
            stopLoading();
        }
    };


    const puedeGenerar =
        empresaId &&
        tomaFisicaInventarioId;


    return (

        <Box>

            <Stack spacing={3}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 3
                    }}
                >

                    <Stack
                        direction={{
                            xs: 'column',
                            md: 'row'
                        }}
                        spacing={2}
                    >

                        <Autocomplete
                            fullWidth
                            options={empresas}
                            getOptionLabel={x => x.nombre}
                            isOptionEqualToValue={
                                (option, value) =>
                                    option.id === value.id
                            }
                            value={
                                empresas.find(
                                    x => x.id === empresaId
                                ) ?? null
                            }
                            onChange={(_, value) =>
                                cambiarEmpresa(value)
                            }
                            renderInput={params => (

                                <TextField
                                    {...params}
                                    label="Empresa"
                                    size="small"
                                    InputProps={{
                                        ...params.InputProps,

                                        startAdornment: (
                                            <>
                                                <BusinessOutlinedIcon
                                                    sx={{
                                                        mr: 1,
                                                        color: 'text.secondary'
                                                    }}
                                                />

                                                {params.InputProps.startAdornment}
                                            </>
                                        )
                                    }}
                                />

                            )}
                        />


                        <Autocomplete
                            fullWidth
                            options={tomasFisicas}
                            disabled={
                                !empresaId ||
                                cargandoTomas
                            }
                            getOptionLabel={x => x.nombre}
                            isOptionEqualToValue={
                                (option, value) =>
                                    option.id === value.id
                            }
                            value={
                                tomasFisicas.find(
                                    x =>
                                        x.id ===
                                        tomaFisicaInventarioId
                                ) ?? null
                            }
                            onChange={(_, value) =>
                                setTomaFisicaInventarioId(
                                    value?.id ?? ''
                                )
                            }
                            renderInput={params => (

                                <TextField
                                    {...params}
                                    label="Toma física"
                                    size="small"
                                    InputProps={{
                                        ...params.InputProps,

                                        startAdornment: (
                                            <>
                                                <InventoryOutlinedIcon
                                                    sx={{
                                                        mr: 1,
                                                        color: 'text.secondary'
                                                    }}
                                                />

                                                {params.InputProps.startAdornment}
                                            </>
                                        ),

                                        endAdornment: (
                                            <>
                                                {cargandoTomas && (
                                                    <CircularProgress
                                                        size={18}
                                                    />
                                                )}

                                                {params.InputProps.endAdornment}
                                            </>
                                        )
                                    }}
                                />

                            )}
                        />

                    </Stack>

                </Paper>


                <Box>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Reportes disponibles
                    </Typography>


                    <Box
                        sx={{
                            display: 'grid',

                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                lg: 'repeat(3, 1fr)'
                            },

                            gap: 2
                        }}
                    >

                        {reportes.map((reporte, index) => (

                            <Paper
                                key={`${reporte.titulo}-${reporte.formato}-${index}`}
                                variant="outlined"
                                sx={{
                                    p: 2.5,
                                    borderRadius: 3,

                                    transition: 'all 0.2s ease',

                                    '&:hover': puedeGenerar
                                        ? {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 3,
                                            borderColor: reporte.color
                                        }
                                        : {}
                                }}
                            >

                                <Stack
                                    spacing={2}
                                    height="100%"
                                >

                                    {/* ICONO */}

                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >

                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,

                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',

                                                borderRadius: 2,

                                                bgcolor: reporte.fondo,
                                                color: reporte.color,

                                                '& svg': {
                                                    fontSize: 28
                                                }
                                            }}
                                        >
                                            {reporte.icono}
                                        </Box>


                                        <Chip
                                            label={reporte.formato}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                color: reporte.color,
                                                bgcolor: reporte.fondo
                                            }}
                                        />

                                    </Stack>


                                    {/* INFORMACIÓN */}

                                    <Box sx={{ flex: 1 }}>

                                        <Typography
                                            fontWeight={700}
                                            fontSize={16}
                                        >
                                            {reporte.titulo}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            mt={0.5}
                                        >
                                            {reporte.descripcion}
                                        </Typography>

                                    </Box>


                                    {/* BOTÓN */}

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={
                                            <DownloadOutlinedIcon />
                                        }
                                        disabled={!puedeGenerar}
                                        onClick={() =>
                                            ejecutarReporte(
                                                reporte.servicio
                                            )
                                        }
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: 2
                                        }}
                                    >
                                        Descargar {reporte.formato}
                                    </Button>

                                </Stack>

                            </Paper>

                        ))}

                    </Box>

                </Box>

            </Stack>

        </Box>
    );
};


export default ReportesAuditoriaEmpresasComponent;