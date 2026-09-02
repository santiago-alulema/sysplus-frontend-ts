import BasePage from "@/componentesCommons/BasePage";
import BarraProgreso from "@/componentesCommons/BarProgressComponent/BarraProgreso";
import { useLoading } from "@/componentesCommons/LoadingContext";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useCallback, useEffect, useState } from "react";
import type { ProgresoInventarioOutDto } from "../models/reporte-progreso.model";
import { obtenerReporteProgresoServicioWeb } from "../services/ProgresoInventarioServicioWeb";
import EmpresaAutocompleteComponent from "@/pages/Inventario/components/EmpresaAutocompleteComponent";
import TomaFisicaAutocompleteComponent from "@/pages/Inventario/components/TomaFisicaAutocompleteComponent";
import { InfoTotalesInventarioCard } from "../components/InfoTotalesInventarioCard";

const ReporteProgresoPage = () => {
  const [progresoInventario, setProgresoInventario] = useState<ProgresoInventarioOutDto | null>(null);
  const [empresaId, setEmpresaId] = useState('');
  const [tomaFisicaInventarioId, setTomaFisicaInventarioId] = useState('');
  const { startLoading, stopLoading } = useLoading();

  const obtenerReporteProgresoInventario = useCallback(async () => {
    try {
      startLoading();

      const respuesta = await obtenerReporteProgresoServicioWeb(empresaId, tomaFisicaInventarioId);
      setProgresoInventario(respuesta);
    } finally {
      stopLoading();
    }
  }, [empresaId, tomaFisicaInventarioId, startLoading, stopLoading]);

  useEffect(() => {
    if (empresaId && tomaFisicaInventarioId)
      obtenerReporteProgresoInventario();
  }, [tomaFisicaInventarioId]);

  return (
    <BasePage title="Reporte de progreso inventario">
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }} >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} >

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
      {progresoInventario && (
        <Box
          sx={{ py: 1, }}
        >
          <Box
            sx={{
              mb: 3,
              px: 2,
              py: 2.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              variant="h5"
              textAlign="center"
              sx={{
                color: "text.primary",
                fontWeight: 700,
                letterSpacing: 0.2,
              }}
            >
              {progresoInventario.nombreInventario}
            </Typography>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{
                mt: 0.5,
                color: "text.secondary",
              }}
            >
              Seguimiento del cumplimiento por responsable
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(1, 1fr)",
                md: "repeat(1, 1fr)",
                lg: "repeat(2, 1fr)",
              },
              gap: 2,
              mb: 2,
            }}
          >
            <Box border={1} padding={2} borderRadius={5} borderColor='#A0A2A1'>
              <Typography textAlign='center' mb={2}>Medición por Items</Typography>
              <Stack direction='row' spacing={2} title="Por registros">
                <InfoTotalesInventarioCard
                  titulo="Total items"
                  informacion={progresoInventario.totalRegistrosOpen.toString()}
                />

                <InfoTotalesInventarioCard
                  titulo="Registros  Items contados"
                  informacion={progresoInventario.totalRegistrosContado.toString()}
                />

                <InfoTotalesInventarioCard
                  titulo="Porcentaje completado"
                  informacion={`${progresoInventario.totalRegistroPorcentaje}%`}
                />
              </Stack>
            </Box>

            <Box border={1} padding={2} borderRadius={5} borderColor='#A0A2A1'>
              <Typography textAlign='center' mb={2}>Medición por UNIDAD</Typography>

              <Stack direction='row' spacing={2} >
                <InfoTotalesInventarioCard
                  titulo="Total unidades"
                  informacion={progresoInventario.totalCantidadOpen.toString()}
                />

                <InfoTotalesInventarioCard
                  titulo="Total unidades contadas"
                  informacion={progresoInventario.totalCantidadContada.toString()}
                />


                <InfoTotalesInventarioCard
                  titulo="Porcentaje unidades"
                  informacion={`${progresoInventario.totalPorcentajeCantitad}%`}
                />
              </Stack>
            </Box>



          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(1, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
              mb: 2,
            }} >
            {progresoInventario.data.map((item) => (
              <Card
                key={item.fecha}
                elevation={0}
                sx={{
                  overflow: "hidden",
                  borderRadius: 2.5,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",

                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <CardHeader
                  title={
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 17,
                          fontWeight: 700,
                        }}
                      >
                        Fecha: {item.fecha}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "text.secondary",
                          mt: 0.3,
                        }}
                      >
                        Total Contado: {item.totalContadoPorDia}
                      </Typography>
                    </Box>
                  }
                  subheader={`${item.progresoGrupo.length} responsable${item.progresoGrupo.length === 1 ? "" : "s"}`}
                  titleTypographyProps={{
                    sx: {
                      color: "text.primary",
                      fontSize: 17,
                      fontWeight: 700,
                    },
                  }}
                  subheaderTypographyProps={{
                    sx: {
                      mt: 0.3,
                      color: "text.secondary",
                      fontSize: 13,
                    },
                  }}
                  sx={{
                    px: 2.5,
                    py: 1.8,
                    backgroundColor: "action.hover",
                  }}
                />

                <Divider />

                <CardContent>
                  <Stack spacing={1.5}>
                    {item.progresoGrupo.map((progress) => (
                      <BarraProgreso
                        key={`${item.fecha}-${progress.nombreResponsable}-${progress.agencia}`}
                        titulo={progress.nombreResponsable}
                        agencia={progress.agencia}
                        inicio={progress.totalCumplido}
                        fin={progress.totalACumplir}
                      />
                    ))}
                  </Stack>

                </CardContent>

              </Card>
            ))}
          </Box>
        </Box>
      )}
    </BasePage>
  );
};

export default ReporteProgresoPage;