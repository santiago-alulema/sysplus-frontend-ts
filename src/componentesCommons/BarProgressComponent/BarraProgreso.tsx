import {
  Box,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

interface BarraProgresoProps {
  titulo: string;
  agencia?: string;
  inicio: number;
  fin: number;
  colorPrincipal?: string;
}

export default function BarraProgreso({
  titulo,
  agencia,
  inicio,
  fin,
  colorPrincipal = "#16A34A"
}: BarraProgresoProps) {

  const porcentaje = fin > 0 ? (inicio / fin) * 100 : 0;

  const porcentajeSeguro = Math.min(
    Math.max(porcentaje, 0),
    100
  );

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        width: "100%",
        p: {
          xs: 1.5,
          sm: 1.8,
        },
        border: "1px solid",
        borderColor: "#E5E7EB",
        borderRadius: 3,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        transition: "all 0.25s ease",

        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "#BFDBFE",
          boxShadow: "0 8px 24px rgba(37, 99, 235, 0.10)",
        },

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          backgroundColor: colorPrincipal,
        },
      }}
    >
      <Stack spacing={1.5}>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#111827",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {titulo}
            </Typography>

            {agencia && (
              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: 500,
                }}
              >
                Agencia: {agencia}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              minWidth: 68,
              px: 1.4,
              py: 0.5,
              borderRadius: 2,
              textAlign: "center",
              backgroundColor: "#EFF6FF",
              border: "1px solid #DBEAFE",
            }}
          >
            <Typography
              sx={{
                color: colorPrincipal,
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {porcentajeSeguro.toFixed(0)}%
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={porcentajeSeguro}
          sx={{
            height: 9,
            borderRadius: 5,
            backgroundColor: "#E5E7EB",

            "& .MuiLinearProgress-bar": {
              backgroundColor: colorPrincipal,
              borderRadius: 5,
              transition: "transform 0.5s ease",
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: "#6B7280",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Completado:{" "}
            <Box
              component="span"
              sx={{
                color: colorPrincipal,
                fontWeight: 800,
              }}
            >
              {inicio.toLocaleString()}
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "#6B7280",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Total:{" "}
            <Box
              component="span"
              sx={{
                color: "#111827",
                fontWeight: 800,
              }}
            >
              {fin.toLocaleString()}
            </Box>
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}