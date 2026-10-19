import SearchBlobal from "@/components/SearchBlobal";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { cambiarNumeroComprobante, informacionComprobante } from "../services/CambioComprobanteService";
import CambioComprobanteInDto from "../models/CambioComprobanteInDto";
import { useLoading } from "@/componentesCommons/LoadingContext";
import { showAlert } from "@/utils/modalAlerts";
import { Decrypt_User } from "@/services/Storage_Service";

const CambioNumeroCoprobante = () => {
  const {startLoading, stopLoading} = useLoading();
  const [parametroBusqueda, setParamnetroBusqueda] = useState<string>("");
  const [nuevoNumeroComprobante, setNuevoNumeroComprobante] = useState<string>("");
  const [comprobante, setComprobante] = useState<CambioComprobanteInDto[]>([]);
  const [buscado, setBuscado] = useState(false);

  const existeComprobante = comprobante.length > 0;

  const limpiarFormulario = () => {
    setParamnetroBusqueda("");
    setNuevoNumeroComprobante("");
    setComprobante([]);
    setBuscado(false);
  };

  const funcionEjecutar = async () => {
    try {
      startLoading();
      const response = await informacionComprobante(parametroBusqueda ?? "");
      setComprobante(response);
      setBuscado(true);
    } finally {
      stopLoading();
    }
  };

  const cambiarValores = async () =>{
     try {
      startLoading();
      const user = Decrypt_User();
      await cambiarNumeroComprobante(comprobante[0].documentno.trim(), nuevoNumeroComprobante.trim(),user.User ,comprobante[0].factura_id);
      limpiarFormulario();
      const configAlert = {
                      title: "Correcto",
                      message: "El numero de coprobante <strong>fue actualizado correctamente.</strong>",
                      type: 'success',
                  };
                  showAlert(configAlert);
    } finally {
      stopLoading();
    }

  }
  return (
    <Box >
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{ p: 0 }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Cambio de número de comprobante
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Busca el comprobante y registra el nuevo número de documento.
              </Typography>
            </Box>

            <Button
              startIcon={<RefreshIcon />}
              onClick={limpiarFormulario}
            >
              Reiniciar
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              pointerEvents: existeComprobante ? "none" : "auto",
              opacity: existeComprobante ? 0.5 : 1,
              mb: 3,
            }}
          >
            <SearchBlobal
              parameterSearch={parametroBusqueda}
              setParameterSearch={setParamnetroBusqueda}
              title="Buscar comprobante"
              functionExecute={funcionEjecutar}
            />
          </Box>

          {buscado && !existeComprobante && (
            <Alert severity="warning">
              No se encontró ningún comprobante con ese criterio de búsqueda.
            </Alert>
          )}

          {existeComprobante && (
            <>
              <Alert severity="success" sx={{ mb: 3 }}>
                Comprobante encontrado correctamente.
              </Alert>

              <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Información del comprobante
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Nombre Cliente
                      </Typography>
                      <Typography fontWeight="bold">
                        {comprobante[0].cliente}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Número Documento
                      </Typography>
                      <Typography fontWeight="bold">
                        {comprobante[0].documentno}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Referencia
                      </Typography>
                      <Typography fontWeight="bold">
                        {comprobante[0].poreference}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Descripción
                      </Typography>
                      <Typography fontWeight="bold">
                        {comprobante[0].description}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Nuevo número de documento"
                    placeholder="Ingrese el nuevo número"
                    value={nuevoNumeroComprobante}
                    onChange={(e) =>
                      setNuevoNumeroComprobante(e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={!nuevoNumeroComprobante}
                    onClick={cambiarValores}
                  >
                    Realizar cambio
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CambioNumeroCoprobante;