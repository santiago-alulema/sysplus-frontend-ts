import { CustomGridColumn } from "@/components/DataGridCrud/CustomGridCrud";
import { ReporteCobroOriginalLiquidacionInDto } from "../Dtos/ReporteCobroOriginalLiquidacionInDto";

export default class ConfiguracionReporteCobroOriginalLiquidacion {
  static columns(): CustomGridColumn<ReporteCobroOriginalLiquidacionInDto>[] {
    return [
      {
        field: "pago",
        headerName: "Pago",
        minWidth: 75,
        editableCrud: false,
      },
      {
        field: "fecha_open",
        headerName: "Fecha Open",
        minWidth: 75,
        editableCrud: false,
        valueFormatter: (params: any) =>
          params.value
            ? new Date(params.value).toLocaleDateString()
            : "",
      },
      {
        field: "fecha_transaccion",
        headerName: "Fecha Transacción",
        minWidth: 75,
        editableCrud: false,
        valueFormatter: (params: any) =>
          params.value
            ? new Date(params.value).toLocaleDateString()
            : "",
      },
      {
        field: "tercero",
        headerName: "Tercero",
        flex: 1,
        editableCrud: false,
        minWidth: 90,
      },
      {
        field: "comercio",
        headerName: "Comercio",
        flex: 2,
        editableCrud: false,
      },
      {
        field: "lote",
        headerName: "Lote",
        flex: 1,
        editableCrud: false,
      },
      {
        field: "recap",
        headerName: "Recap",
        flex: 1,
        editableCrud: false,
      },
      {
        field: "factura_cliente",
        headerName: "Factura Cliente",
        minWidth: 70,
        editableCrud: false,
      },
      {
        field: "banco_procesador",
        headerName: "Banco Procesador",
        minWidth: 90,
        editableCrud: false,
      },
      {
        field: "usuario_1",
        headerName: "Usuario",
        minWidth: 90,
        editableCrud: false,
      },
      {
        field: "date",
        headerName: "F. Liq",
        minWidth: 90,
        editableCrud: false,
        valueFormatter: (params: any) =>
        params.value
          ? new Date(params.value).toLocaleDateString()
          : "",
      },
      {
        field: "importe_deposito",
        headerName: "Importe Depósito",
        minWidth: 60,
        editableCrud: false,
      },
      {
        field: "total_cuotas",
        headerName: "Total Cuotas",
        minWidth: 60,
        editableCrud: false,
        type: "number",
      },
      {
        field: "numero_cuota",
        headerName: "N° Cuota",
        minWidth: 60,
        editableCrud: false,
        type: "number",
      },
      {
        field: "pago_cuota",
        headerName: "Pago Cuota",
        minWidth: 60,
        editableCrud: false,
        type: "number",
        valueFormatter: (params: any) =>
          params.value != null
            ? Number(params.value).toFixed(2)
            : "",
      },
      {
        field: "esta_pagado",
        headerName: "Pagado",
        minWidth: 60,
        editableCrud: false,
        valueFormatter: (params: any) =>
          params.value ? "Sí" : "No",
      },
      {
        field: "cuotas_liquidadas",
        headerName: "Cuotas Liquidadas",
        minWidth: 60,
        editableCrud: false,
        type: "number",
      },
      {
        field: "cuotas_pendientes",
        headerName: "Cuotas Pendientes",
        minWidth: 60,
        editableCrud: false,
        type: "number",
      },
      {
        field: "total_liquidado",
        headerName: " Total Liquidado",
        minWidth: 60,
        editableCrud: false,
        type: "number",
        valueFormatter: (params: any) =>
          params.value != null
            ? Number(params.value).toFixed(2)
            : "",
      },
      {
        field: "valor_pendiente",
        headerName: "Valor Pendiente",
        minWidth: 60,
        editableCrud: false,
        type: "number",
        valueFormatter: (params: any) =>
          params.value != null
            ? Number(params.value).toFixed(2)
            : "",
      },
    ];
  }
}