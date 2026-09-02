import { useMemo } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

interface InfoCardProps {
  titulo: string;
  informacion: string;
}

export const InfoTotalesInventarioCard = ({
  titulo,
  informacion,
}: InfoCardProps) => {
  const color = useMemo(() => {
    const colores = [
      "#1976d2", 
      "#2e7d32",
      "#ed6c02", 
      "#9c27b0", 
      "#d32f2f", 
      "#0288d1", 
      "#00897b", 
      "#5e35b1", 
    ];

    return colores[Math.floor(Math.random() * colores.length)];
  }, []);

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        backgroundColor: "#fff",
        overflow: "hidden",
        transition: "all 0.25s ease",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px ${color}25`,
          borderColor: color,
        },

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          backgroundColor: color,
        },
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: "text.secondary",
            textTransform: "uppercase",
          }}
        >
          {titulo}
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          gap={1}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: color,
              flexShrink: 0,
            }}
          />

          <Typography
            sx={{
              fontSize: {
                xs: 24,
                md: 28,
              },
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {informacion}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};