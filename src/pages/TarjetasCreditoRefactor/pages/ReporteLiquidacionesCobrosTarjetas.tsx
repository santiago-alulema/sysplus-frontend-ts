import { CustomGridCrud } from "@/components/DataGridCrud/CustomGridCrud";
import { Button, Grid } from "@mui/material";
import { ReporteCobroOriginalLiquidacionInDto } from "../Dtos/ReporteCobroOriginalLiquidacionInDto";
import ConfiguracionReporteCobroOriginalLiquidacion from "../configs/ConfiguracionReporteCobroOriginalLiquidacion";
import { useEffect, useState } from "react";
import { useLoading } from "@/componentesCommons/LoadingContext";
import { DescargarReporteTarjetaCreditoServicioWeb, ListarLiquidacionesTarjetaCreditoServicioWeb } from "../services/TarjetasCreditoServices";

const ReporteLiquidacionesCobrosTarjetas = () => {
  const [reporte, setReporte] = useState<ReporteCobroOriginalLiquidacionInDto[]>([]);
  const { startLoading, stopLoading } = useLoading();

  const vizualizarReporte = async () => {
    try {
      startLoading();
      const reporte = await ListarLiquidacionesTarjetaCreditoServicioWeb();
      setReporte(reporte);
    } finally {
      stopLoading();
    }
  }
  
  const descargarReporte = async () => {
    try {
      startLoading();
      await DescargarReporteTarjetaCreditoServicioWeb();
    } finally {
      stopLoading();
    }
  }

  useEffect(() => {
    vizualizarReporte();
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item lg={12} textAlign='right'>
        <Button onClick={descargarReporte} variant="contained">Descargar reporte EXCEL</Button>
      </Grid>
      <Grid item lg={12} sm={12} xs={12}>
        <CustomGridCrud<ReporteCobroOriginalLiquidacionInDto>
          title="Pagos originales"
          rows={reporte}
          columns={ConfiguracionReporteCobroOriginalLiquidacion.columns()}
          canEdit={false}
          canDelete={false}
          canCreate={false}
          hideActions={true}
        />
      </Grid>
    </Grid>
  )
}

export default ReporteLiquidacionesCobrosTarjetas