import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import RestoreIcon from '@mui/icons-material/Restore';
import { useEffect, useState } from 'react';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import type { OpcionInventario } from '../models/AgenciaAuditoria';
import { obtenerEmpresas } from '../services/agencia-auditoria.service';

import {
    descargarActaInvetarioServicioWeb,
    descargarFinalConsolidadoExcelServicioWeb,
    descargarFinalConsolidadoPdfServicioWeb,
    descargarFinalConsolidadoTXTServicioWeb,
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

    const reportes = [
        {
            titulo: 'Reporte diario por grupo',
            descripcion: 'Reporte correspondiente a usuarios.',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',
            servicio: () => descargarReportesPorUsuariosServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Consolidado diario',
            descripcion: 'Detalle diario de responsables.',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',
            servicio: () => descargarReporteDiarioServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Consolidado diario',
            descripcion: 'Detalle diario de responsables.',
            formato: 'EXCEL',
            icono: <TableViewOutlinedIcon />,
            color: '#2e7d32',
            fondo: '#f3faf4',
            servicio: () => descargarReporteDiarioExcelServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Reporte final al cierre',
            descripcion: 'Resultado al finalizar la toma física.',
            formato: 'EXCEL',
            icono: <TableViewOutlinedIcon />,
            color: '#2e7d32',
            fondo: '#f3faf4',
            servicio: () => descargarReporteFinalExcelServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Reporte final al cierre',
            descripcion: 'Resultado al finalizar la toma física.',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',
            servicio: () => descargarReporteFinalPdfServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Consolidado final',
            descripcion: 'Resultado consolidado del inventario.',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',
            servicio: () => descargarFinalConsolidadoPdfServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Consolidado final',
            descripcion: 'Resultado consolidado del inventario.',
            formato: 'EXCEL',
            icono: <TableViewOutlinedIcon />,
            color: '#2e7d32',
            fondo: '#f3faf4',
            servicio: () => descargarFinalConsolidadoExcelServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Consolidado final (TXT)',
            descripcion: 'Resultado consolidado del inventario.',
            formato: 'TXT',
            icono: <TextFormatIcon />,
            color: '#3d3b3b',
            fondo: '#c3bdea',
            servicio: () => descargarFinalConsolidadoTXTServicioWeb(empresaId, tomaFisicaInventarioId)
        },
        {
            titulo: 'Acta de responsabilidad',
            descripcion: 'Documento legal de finalización.',
            formato: 'PDF',
            icono: <PictureAsPdfOutlinedIcon />,
            color: '#d32f2f',
            fondo: '#fff5f5',
            servicio: () => descargarActaInvetarioServicioWeb(tomaFisicaInventarioId)
        },
        {
            titulo: 'Ítems para reconteo',
            descripcion: 'Productos que requieren reconteo.',
            formato: 'EXCEL',
            icono: <RestoreIcon />,
            color: '#2e7d32',
            fondo: '#f3faf4',
            servicio: () => descargarReporteParaReconteoServicioWeb(tomaFisicaInventarioId)
        }
    ];

    const gruposReportes = [
        {
            titulo: 'Seguimiento diario',
            reportes: reportes.slice(0, 3)
        },
        {
            titulo: 'Cierre de toma física',
            reportes: reportes.slice(3, 5)
        },
        {
            titulo: 'Consolidación final',
            reportes: reportes.slice(5, 8)
        },
        {
            titulo: 'Documentación y reconteo',
            reportes: reportes.slice(8, 10)
        }
    ];

    const ejecutarReporte = async (servicio: () => Promise<unknown>) => {
        startLoading();

        try {
            const resultado = await servicio();

            if (resultado === false) return;

            showAlert({
                title: 'Correcto',
                type: 'success',
                message: 'El reporte se descargó correctamente.'
            });
        } catch {
            showAlert({
                title: 'Error',
                type: 'error',
                message: 'No se pudo generar el reporte.'
            });
        } finally {
            stopLoading();
        }
    };

    const puedeGenerar = Boolean(empresaId && tomaFisicaInventarioId);

    return (
        <Box>
            <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
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

            <Typography fontSize={18} fontWeight={700}>
                Reportes de auditoría
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={2}>
                Seleccione el reporte que desea descargar.
            </Typography>

            <Stack spacing={2.5}>
                {gruposReportes.map(grupo => (
                    <Box key={grupo.titulo}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <Typography fontSize={14} fontWeight={700}>
                                {grupo.titulo}
                            </Typography>

                            <Divider sx={{ flex: 1 }} />
                        </Stack>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                    xl: 'repeat(4, 1fr)'
                                },
                                gap: 1.5
                            }}
                        >
                            {grupo.reportes.map((reporte, index) => (
                                <Paper
                                    key={`${reporte.titulo}-${reporte.formato}-${index}`}
                                    variant="outlined"
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        transition: '0.2s',
                                        '&:hover': puedeGenerar
                                            ? {
                                                borderColor: reporte.color,
                                                boxShadow: 1
                                            }
                                            : {}
                                    }}
                                >
                                    <Stack spacing={1.2}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Box
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 1.5,
                                                    bgcolor: reporte.fondo,
                                                    color: reporte.color,
                                                    '& svg': { fontSize: 20 }
                                                }}
                                            >
                                                {reporte.icono}
                                            </Box>

                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography fontSize={13.5} fontWeight={700} lineHeight={1.2}>
                                                    {reporte.titulo}
                                                </Typography>

                                                <Typography
                                                    fontSize={11.5}
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 0.3,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {reporte.descripcion}
                                                </Typography>
                                            </Box>

                                            <Chip
                                                label={reporte.formato}
                                                size="small"
                                                sx={{
                                                    height: 22,
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    color: reporte.color,
                                                    bgcolor: reporte.fondo
                                                }}
                                            />
                                        </Stack>

                                        <Button
                                            fullWidth
                                            size="small"
                                            variant="text"
                                            startIcon={<DownloadOutlinedIcon />}
                                            disabled={!puedeGenerar}
                                            onClick={() => ejecutarReporte(reporte.servicio)}
                                            sx={{
                                                minHeight: 30,
                                                justifyContent: 'flex-start',
                                                px: 1,
                                                color: reporte.color,
                                                textTransform: 'none',
                                                fontSize: 12,
                                                fontWeight: 600
                                            }}
                                        >
                                            Descargar
                                        </Button>
                                    </Stack>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default ReportesAuditoriaEmpresasComponent;