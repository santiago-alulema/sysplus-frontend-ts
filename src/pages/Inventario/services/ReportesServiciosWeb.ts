import { ReportesEndPoint } from "@/pages/Inventario/services/ReportesEndPoint";
import { request } from "@/utils/AxiosUtils";

export const descargarReporteCortesServicioWeb = (empresId: string, tomaFisicaId: string, corte: number) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_CORTES_DIARIOS}/${empresId}/${tomaFisicaId}/${corte}`

    );


export const descargarReporteDiarioServicioWeb = (empresId: string, tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_DIARIOS}/${empresId}/${tomaFisicaId}`

    );

export const descargarReporteFinalPdfServicioWeb = (empresId: string, tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_FINAL_PDF}/${empresId}/${tomaFisicaId}`

    );

export const descargarReporteFinalExcelServicioWeb = (empresId: string, tomaFisicaId: string) =>
    request<string>(
        'get',
        `${ReportesEndPoint.DESCARGAR_REPORTE_FINAL_EXCEL}/${empresId}/${tomaFisicaId}`

    );
