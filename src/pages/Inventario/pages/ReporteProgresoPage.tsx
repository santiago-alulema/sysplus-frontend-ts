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
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useCallback, useEffect, useState } from "react";
import type { ProgresoInventarioOutDto } from "../models/reporte-progreso.model";
import { obtenerReporteProgresoServicioWeb } from "../services/ProgresoInventarioServicioWeb";
import EmpresaAutocompleteComponent from "@/pages/Inventario/components/EmpresaAutocompleteComponent";
import TomaFisicaAutocompleteComponent from "@/pages/Inventario/components/TomaFisicaAutocompleteComponent";

const ReporteProgresoPage = () => {
  const [progresoInventario, setProgresoInventario] = useState<ProgresoInventarioOutDto | null>(null);
  const [empresaId, setEmpresaId] = useState('');
  const [tomaFisicaInventarioId, setTomaFisicaInventarioId] = useState('');
  const { startLoading, stopLoading } = useLoading();

  const obtenerReporteProgresoInventario = useCallback(async () => {
    try {
      startLoading();

      const respuesta = await obtenerReporteProgresoServicioWeb(
        empresaId,
        tomaFisicaInventarioId
      );

      setProgresoInventario(respuesta);

    } catch (error) {
      console.error(
        "Error al obtener el reporte de progreso del inventario:",
        error
      );
    } finally {
      stopLoading();
    }
  }, [
    empresaId,
    tomaFisicaInventarioId,
    startLoading,
    stopLoading
  ]);

  useEffect(() => {
    if (empresaId && tomaFisicaInventarioId)
      obtenerReporteProgresoInventario();
  }, [tomaFisicaInventarioId]);

  return (
    <BasePage title="Reporte de progreso inventario">
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
      {progresoInventario && (
        <Container
          maxWidth="lg"
          disableGutters
          sx={{
            py: 1,
          }}
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

          <Stack spacing={2.5}>
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
                  title={`Fecha: ${item.fecha}`}
                  subheader={`${item.progresoGrupo.length} responsable${item.progresoGrupo.length === 1 ? "" : "s"
                    }`}
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

                <CardContent
                  sx={{
                    p: 2.5,

                    "&:last-child": {
                      pb: 2.5,
                    },
                  }}
                >
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
          </Stack>
        </Container>
      )}
    </BasePage>
  );
};

export default ReporteProgresoPage;