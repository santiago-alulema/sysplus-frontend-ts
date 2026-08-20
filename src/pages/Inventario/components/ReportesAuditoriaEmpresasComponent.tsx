import {
    Box,
    Button,
    Chip,
    Paper,
    Stack,
    Typography
} from '@mui/material';

import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import RestoreIcon from '@mui/icons-material/Restore';
import { useEffect, useState } from 'react';

import type { OpcionInventario } from '../models/AgenciaAuditoria';

import {
    obtenerEmpresas,
    // obtenerTomasFisicas
} from '../services/agencia-auditoria.service';

import {
    descargarActaInvetarioServicioWeb,
    descargarReporteDiarioExcelServicioWeb,
    descargarReporteDiarioServicioWeb,
    descargarReporteFinalExcelServicioWeb,
    descargarReporteFinalPdfServicioWeb,
    descargarReporteParaReconteoServicioWeb,
    descargarReportesPorUsuariosServicioWeb
} from '@/pages/Inventario/services/ReportesServiciosWeb';

import { useLoading } from '@/componentesCommons/LoadingContext';
import { showAlert } from '@/utils/modalAlerts';
import EmpresaAutocompleteComponent from '@/pages/Inventario/components/EmpresaAutocompleteComponent';
import TomaFisicaAutocompleteComponent from '@/pages/Inventario/components/TomaFisicaAutocompleteComponent';


const ReportesAuditoriaEmpresasComponent = () => {
    const [, setEmpresas] = useState<OpcionInventario[]>([]);
    const [empresaId, setEmpresaId] = useState('');
    const [tomaFisicaInventarioId, setTomaFisicaInventarioId] = useState('');
    const { startLoading, stopLoading } = useLoading();

    useEffect(() => {
        obtenerEmpresas().then(setEmpresas);
    }, []);


    // const cambiarEmpresa = async (
    //     empresa: OpcionInventario | null
    // ) => {

    //     const id = empresa?.id ?? '';

    //     setEmpresaId(id);
    //     setTomaFisicaInventarioId('');
    //     setTomasFisicas([]);

    //     if (!id)
    //         return;

    //     setCargandoTomas(true);

    //     try {
    //         const response = await obtenerTomasFisicas(id);
    //         setTomasFisicas(response);
    //     }
    //     finally {
    //         setCargandoTomas(false);
    //     }
    // };

    const reportes = [
        {
            titulo: 'Reporte diario por grupo',
            descripcion: 'Genera el reporte correspondiente a usuarios',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',
            servicio: () => descargarReportesPorUsuariosServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Reporte consolidado por dia (PDF)',
            descripcion: 'Detalle diario de responsables de toma física.',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',
            servicio: () => descargarReporteDiarioServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Reporte consolidado por dia (EXCEL)',
            descripcion: 'Detalle diario de responsables de toma física.',
            formato: 'EXCEL',
            icono: <TableViewOutlinedIcon />,
            color: '#2e7d32',
            fondo: '#fff5f5',
            servicio: () => descargarReporteDiarioExcelServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Reporte final al cierre de la toma fisica (EXCEL)',
            descripcion: 'Reporte consolidado final del inventario.',
            formato: 'EXCEL',
            icono: <TableViewOutlinedIcon />,
            color: '#2e7d32',
            fondo: '#f3faf4',
            servicio: () => descargarReporteFinalExcelServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Reporte final al cierre de la toma fisica (PDF)',
            descripcion: 'Reporte consolidado final del inventario.',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',
            servicio: () => descargarReporteFinalPdfServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Acta responsabilidad auditoria (PDF)',
            descripcion: 'Acta legal para finalizacion del inventario.',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',
            servicio: () => descargarActaInvetarioServicioWeb(tomaFisicaInventarioId)
        },
        {
            titulo: 'Descargar items reconteo (EXCEL)',
            descripcion: 'Descargar reporte para subir reconteo',
            formato: 'EXCEL',
            icono: <RestoreIcon />,
            color: '#2fd381',
            fondo: '#fff5f5',
            servicio: () => descargarReporteParaReconteoServicioWeb(tomaFisicaInventarioId)
        },
        // {
        //     titulo: 'Reporte diario',
        //     descripcion: 'Reporte general diario de la toma física.',
        //     formato: 'PDF',
        //     icono: <PictureAsPdfOutlinedIcon />,
        //     color: '#d32f2f',
        //     fondo: '#fff5f5',
        //     servicio: () =>descargarReporteFinalPdfServicioWeb(empresaId,tomaFisicaInventarioId )
        // },
        // {
        //     titulo: 'Reporte diario',
        //     descripcion: 'Reporte general diario de la toma física.',
        //     formato: 'EXCEL',
        //     icono: <TableViewOutlinedIcon />,
        //     color: '#2e7d32',
        //     fondo: '#f3faf4',
        //     servicio: () =>descargarReporteFinalExcelServicioWeb(empresaId,tomaFisicaInventarioId)
        // }
    ];


    const ejecutarReporte = async (servicio: () => Promise<unknown>) => {
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

    const puedeGenerar = empresaId && tomaFisicaInventarioId;

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

                        <EmpresaAutocompleteComponent
                            value={empresaId}
                            onChange={id => {
                                setEmpresaId(id);
                                setTomaFisicaInventarioId('');
                            }}
                        />

                        <TomaFisicaAutocompleteComponent
                            empresaId={empresaId}
                            value={tomaFisicaInventarioId}
                            onChange={setTomaFisicaInventarioId}
                        />

                    </Stack>

                </Paper>


                <Box>

                    <Typography variant="h6" fontWeight={700} >
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
                                        startIcon={<DownloadOutlinedIcon />}
                                        disabled={!puedeGenerar}
                                        onClick={() =>
                                            ejecutarReporte(reporte.servicio)
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