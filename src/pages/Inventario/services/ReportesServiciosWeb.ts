import { ReportesEndPoint } from "@/pages/Inventario/services/ReportesEndPoint";
import { request } from "@/utils/AxiosUtils";

export const descargarReportesPorUsuariosServicioWeb = (empresId: string, tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_POR_USUARIOS}/${empresId}/${tomaFisicaId}`,
        undefined,
        undefined,
        true

    );


export const descargarReporteDiarioServicioWeb = (empresId: string, tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_DIARIOS}/${empresId}/${tomaFisicaId}`,
        undefined,
        undefined,
        true

    );


export const descargarReporteDiarioExcelServicioWeb = (empresId: string, tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_DIARIOS_EXCEL}/${empresId}/${tomaFisicaId}`,
        undefined,
        undefined,
        true

    );

export const descargarReporteFinalPdfServicioWeb = (empresId: string, tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_FINAL_PDF}/${empresId}/${tomaFisicaId}`,
        undefined,
        undefined,
        true

    );

export const descargarReporteFinalExcelServicioWeb = (empresId: string, tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_FINAL_EXCEL}/${empresId}/${tomaFisicaId}`,
        undefined,
        undefined,
        true
    );
