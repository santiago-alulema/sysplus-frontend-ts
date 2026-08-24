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


export const descargarReporteParaReconteoServicioWeb = (tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_PARA_SUBIR_RECONTEO}/${tomaFisicaId}`,
        undefined,
        undefined,
        true
    );

export const descargarActaInvetarioServicioWeb = (tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_ACTA_FIRMAS}/${tomaFisicaId}`,
        undefined,
        undefined,
        true
    );



export const descargarFinalConsolidadoExcelServicioWeb = (empresaId: string, tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_FINAL_CONSOLIDADO_EXCEL}/${empresaId}/${tomaFisicaId}`,
        undefined,
        undefined,
        true
    );


export const descargarFinalConsolidadoPdfServicioWeb = (empresaId: string, tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_FINAL_CONSOLIDADO_PDF}/${empresaId}/${tomaFisicaId}`,
        undefined,
        undefined,
        true
    );


export const descargarFinalConsolidadoTXTServicioWeb = (empresaId: string, tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_FINAL_CONSOLIDADO_TXT}/${empresaId}/${tomaFisicaId}`,
        undefined,
        undefined,
        true
    );


