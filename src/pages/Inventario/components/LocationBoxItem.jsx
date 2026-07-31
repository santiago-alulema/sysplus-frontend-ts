import { LocalizacionItemsRangoConfig } from "@/pages/Inventario/configs/LocalizacionItemsRangoConfig";
import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import { useEffect } from "react";

const LocationBoxItem = ({ value, onChange, sxTextField }) => {
  const handleChange = (campo) => (e, nuevaOpcion) => {
    console.log("nuevaOpcion", nuevaOpcion)
    onChange({
      ...value,
      [campo]: nuevaOpcion.value,
    });
  };


  const generarOpcionesRango = (inicio, fin) => {
    return Array.from(
      { length: fin - inicio + 1 },
      (_, index) => ({ label: index.toString(), value: index.toString() })
    )
  }

  const rangos = LocalizacionItemsRangoConfig;

  const racs = generarOpcionesRango(rangos.rac.inicio, rangos.rac.fin);
  const columnas = generarOpcionesRango(rangos.columna.inicio, rangos.columna.fin);
  const niveles = generarOpcionesRango(rangos.nivel.inicio, rangos.nivel.fin);
  const posicion = generarOpcionesRango(rangos.posicion.inicio, rangos.posicion.fin);



  useEffect(() => {
    generarOpcionesRango(1, 19)
  }, [])

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        height: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      <Typography
        variant="body2"
        fontWeight="bold"
        color="text.secondary"
        mb={2}
      >
        Localización del item
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          {/* <TextField
            label="RAC"
            variant="standard"
          
            value={value.rac}
            onChange={handleChange("rac")}
            fullWidth
            sx={sxTextField}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            slotProps={{ htmlInput: { maxLength: 1 } }}
          /> */}
          <Autocomplete
            options={racs}
            fullWidth
            autoHighlight
            autoSelect
            openOnFocus
            value={value.rac ?? null}
            onChange={handleChange("rac")}
            renderInput={(params) => (
              <TextField {...params} label="Rac" />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          {/* <TextField
            label="Columna"
            variant="standard"
            value={value.columna}
            onChange={handleChange("columna")}
            fullWidth
            sx={sxTextField}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          /> */}
          <Autocomplete
            options={columnas}
            fullWidth
            value={value.columna ?? null}
            autoHighlight
            autoSelect
            openOnFocus
            onChange={handleChange("columna")}
            renderInput={(params) => <TextField {...params} label="Columna" />} />
        </Grid>

        <Grid item xs={12} md={3}>
          {/* <TextField
            label="Nivel"
            variant="standard"
            value={value.nivel}
            onChange={handleChange("nivel")}
            fullWidth
            sx={sxTextField}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          /> */}
          <Autocomplete
            options={niveles}
            fullWidth
            autoHighlight
            autoSelect
            openOnFocus
            value={value.nivel ?? null}
            onChange={handleChange("nivel")}
            renderInput={(params) => <TextField {...params} label="Nivel" />} />
        </Grid>

        <Grid item xs={12} md={3}>
          {/* <TextField
            label="Posición"
            variant="standard"
            value={value.posicion}
            onChange={handleChange("posicion")}
            fullWidth
            sx={sxTextField}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          /> */}
          <Autocomplete
            options={posicion}
            fullWidth
            value={value.posicion ?? null}
            autoHighlight
            autoSelect
            openOnFocus
            onChange={handleChange("posicion")}
            renderInput={(params) => <TextField {...params} label="Posición" />} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationBoxItem;