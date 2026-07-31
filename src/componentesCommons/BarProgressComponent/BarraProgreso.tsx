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
}

export default function BarraProgreso({
  titulo,
  agencia,
  inicio,
  fin,
}: BarraProgresoProps) {
  const porcentaje =
    fin > 0
      ? (inicio / fin) * 100
      : 0;

  const porcentajeSeguro = Math.min(
    Math.max(porcentaje, 0),
    100
  );

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: {
          xs: 1.5,
          sm: 2,
        },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.default",
        transition: "border-color 0.2s ease, background-color 0.2s ease",

        "&:hover": {
          borderColor: "primary.light",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack spacing={1.3}>
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
              variant="subtitle2"
              sx={{
                color: "text.primary",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {titulo}
            </Typography>

            {agencia && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                Agencia: {agencia}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              minWidth: 65,
              px: 1.2,
              py: 0.5,
              borderRadius: 5,
              textAlign: "center",
              backgroundColor: "primary.main",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "primary.contrastText",
                fontSize: 13,
                fontWeight: 700,
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
            backgroundColor: "action.selected",

            "& .MuiLinearProgress-bar": {
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
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            Completado:{" "}
            <Box
              component="span"
              sx={{
                color: "text.primary",
                fontWeight: 700,
              }}
            >
              {inicio}
            </Box>
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            Total:{" "}
            <Box
              component="span"
              sx={{
                color: "text.primary",
                fontWeight: 700,
              }}
            >
              {fin}
            </Box>
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}