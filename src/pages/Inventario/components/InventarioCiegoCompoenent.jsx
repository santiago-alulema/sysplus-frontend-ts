
import DescripcionItem from '@/components/AuditoriaStock/DescripcionItem';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import LocationBoxItem from './LocationBoxItem';

import styles from '../css/InventarioComponent.module.css';

const InventarioCiegoCompoenent = ({ inventario }) => {

  const {
    seleccionarAgencia,
    userLogin,
    codigoProducto,
    setCodigoProducto,
    setCodProducto,
    descripcion,
    setDescripcion,
    organizations,
    setOrganizations,
    counterComponent,
    cantidad,
    cantidadBuenEstado,
    setCantidadBuenEstado,
    cantidadMalEstado,
    setCantidadMalEstado,
    setCountProduct,
    existProduct,
    checkProductExist,
    esSobrante,
    generarSobrante,
    observacion,
    setObservacion,
    observationSelection,
    SelectObservation,
    habiliatObsercacion,
    isKit,
    CheckIsKit,
    estadoKit,
    handleKitStateChange,
    observacionesKit,
    setObservacionesKit,
    activarObservacionesKit,
    ubicacion,
    setUbicacion,
    estiloLaberBuenMalEstado,
    grabarItem,
    cantidadRevision,
    setCantidadRevision
  } = inventario;

  const estadosProducto =
    userLogin?.Parametros?.estados_unnoparts_inventario
      ? [
        { value: 'OBSOLETO', label: 'Obsoleto' },
        { value: 'CADUCADO', label: 'Caducado' },
        { value: 'USADO', label: 'Usado' },
        { value: 'RAYADO', label: 'Rayado' },
        { value: 'OTROS', label: 'Otros' }
      ]
      : [
        { value: 'CADUCADO', label: 'Caducado' },
        { value: 'DAÑADO', label: 'Dañado' },
        { value: 'REVISION', label: 'Revisión' }
      ];

  return (
    <Paper
  className={styles.inventarioCompacto}
  elevation={4}
  sx={{
    width: '100%',
    mx: 'auto',
    borderRadius: 3,
    textAlign: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    display:
      seleccionarAgencia === '0' || !seleccionarAgencia
        ? 'none'
        : 'block'
  }}
>
      {/* <Typography
        textAlign="center"
        id="modal-modal-title"
        variant="h6"
        component="h2"
        sx={{
          mb: 3,
          fontWeight: 800,
          color: '#111827',
          letterSpacing: 0.6
        }}
      >
        TOMA FÍSICA INVENTARIO CIEGO
      </Typography> */}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Divider
            sx={{
              '&::before, &::after': {
                borderColor: '#d1d5db'
              }
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: '#374151',
                letterSpacing: 0.5
              }}
            >
              INFORMACIÓN PRODUCTO
            </Typography>
          </Divider>
        </Grid>

        <Grid item xs={12} md={6} />

        <Grid item lg={userLogin?.Parametros?.tiene_multi_inventarios ? 12 : 12} xs={12} md={6}>
          <FormGroup
            sx={{
              alignItems: { xs: 'flex-start', md: 'flex-end' }
            }}
          >
            <FormControlLabel
              onChange={checkProductExist}
              control={<Checkbox checked={existProduct} />}
              label="PRODUCTO NO IDENTIFICADO"
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '13px',
                },
              }}
            />
          </FormGroup>
        </Grid>

        <Grid item lg={userLogin?.Parametros?.tiene_multi_inventarios ? 12 : 6} sm={12} xs={12}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb'
            }}
          >
            {!existProduct ? (
              <DescripcionItem
                key={counterComponent}
                organizations={organizations}
                setOrganizations={setOrganizations}
                setCodProducto={setCodProducto}
                setDescriptionProduct={setDescripcion}
              />
            ) : (
              <>
                <FormGroup sx={{ mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={esSobrante}
                        onChange={(e) => generarSobrante(e.target.checked)}
                      />
                    }
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '13px',
                      },
                    }}
                    label="SOBRANTE"
                  />
                </FormGroup>

                <TextField
                  id="codProducto"
                  size='small'
                  label="CÓDIGO PRODUCTO"
                  variant="outlined"
                  value={codigoProducto}
                  sx={{
                    display: esSobrante ? 'none' : 'block',
                    '& .MuiInputBase-root': {
                      minHeight: 38,
                      borderRadius: 2,
                      fontSize: 13,
                    },

                    '& .MuiInputBase-input': {
                      py: 0.8,
                      fontSize: 13,
                    },

                    '& .MuiInputLabel-root': {
                      fontSize: 13,
                    },

                    '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                      fontSize: 12.5,
                    },

                    '& .MuiSvgIcon-root': {
                      fontSize: 19,
                    },
                  }}
                  onChange={(e) => setCodigoProducto(e.target.value)}
                  fullWidth
                />
              </>

            )}
            {existProduct && (
              <Grid item mt={2} lg={userLogin?.Parametros?.tiene_multi_inventarios ? 12 : 12} sm={12} xs={12}>
                <TextField
                  id="DESCRIPCION"
                  label="DESCRIPCIÓN"
                  size='small'
                  variant="outlined"
                  value={descripcion}
                  sx={{
                    '& .MuiInputBase-root': {
                      minHeight: 38,
                      borderRadius: 2,
                      fontSize: 13,
                    },

                    '& .MuiInputBase-input': {
                      py: 0.8,
                      fontSize: 13,
                    },

                    '& .MuiInputLabel-root': {
                      fontSize: 13,
                    },

                    '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                      fontSize: 12.5,
                    },

                    '& .MuiSvgIcon-root': {
                      fontSize: 19,
                    },
                  }}
                  onChange={(e) => setDescripcion(e.target.value)}
                  fullWidth
                />
              </Grid>
            )}
          </Box>
        </Grid>

        <Grid item lg={userLogin?.Parametros?.tiene_multi_inventarios ? 12 : 6} sm={12} xs={12}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb'
            }}
            mb={1}
          >
            <Grid container spacing={1} mt={0.0001} >
              <Grid item lg={3} sm={12} xs={12}>
                <TextField
                  id="CANTIDAD_BUEN_ESTADO"
                  label="BUEN ESTADO"
                  value={cantidadBuenEstado}
                  onChange={(e) => setCountProduct(e, setCantidadBuenEstado)}
                  fullWidth
                  autoComplete="off"
                  inputProps={{
                    autoComplete: 'off',
                    form: {
                      autoComplete: 'off'
                    }
                  }}
                  sx={estiloLaberBuenMalEstado('#4CAF50')}
                />
              </Grid>

              <Grid item lg={3} sm={12} xs={12}>
                <TextField
                  id="CANTIDAD MAL ESTADO"
                  label="MAL ESTADO"
                  value={cantidadMalEstado}
                  onChange={(e) => setCountProduct(e, setCantidadMalEstado)}
                  fullWidth
                  sx={estiloLaberBuenMalEstado('#FF5733')}
                />
              </Grid>

              <Grid item lg={3} sm={12} xs={12}>
                <TextField
                  id="CANTIDAD REVISION"
                  label="REVISION"
                  value={cantidadRevision}
                  onChange={(e) => setCountProduct(e, setCantidadRevision)}
                  fullWidth
                  sx={estiloLaberBuenMalEstado('#33346d')}
                />
              </Grid>

              <Grid item lg={userLogin?.Parametros?.tiene_multi_inventarios ? 3 : 3} sm={12} xs={12}>
                <TextField
                  id="CANTIDAD TOTAL"
                  label="TOTAL CONTADO"
                  value={cantidad}
                  disabled
                  fullWidth
                  sx={{
                    "& .MuiInputBase-input": {
                      fontWeight: 700,
                      fontSize: 18,
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000",
                      opacity: 1,
                    },
                    "& .MuiInputLabel-shrink": {
                      fontWeight: 900,
                      fontSize: 18,
                    },
                    "& .MuiInputLabel.Mui-disabled": {
                      opacity: 1,
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          lg={userLogin?.Parametros?.tiene_multi_inventarios ? 12 : 6}
        >
          <FormControl
            fullWidth
            disabled={Number(cantidadMalEstado) <= 0}
          >
            <InputLabel
              id="observaciones-label"
              sx={{ fontSize: 13 }}
            >
              Estado del producto
            </InputLabel>

            <Select
              labelId="observaciones-label"
              id="observaciones"
              label="Estado del producto"
              value={observationSelection ?? '0'}
              onChange={(event) => SelectObservation(event.target.value)}
              sx={{
                height: 40,
                borderRadius: 2,
                fontSize: 14,

                '& .MuiSelect-select': {
                  py: 0.8,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      minHeight: 40,
                      fontSize: 14,
                    },
                  },
                },
              }}
            >
              <MenuItem value="0">Seleccione un estado</MenuItem>
              {estadosProducto.map((estado) => (
                <MenuItem
                  key={estado.value}
                  value={estado.value}
                  sx={{ fontSize: 13 }}
                >
                  {estado.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {userLogin?.Parametros?.tiene_rack_inventario && (
          <Grid item lg={userLogin?.Parametros?.tiene_multi_inventarios ? 12 : 6}
            xs={12}
            md={6}>
            <LocationBoxItem
              value={ubicacion}
              onChange={setUbicacion}
              sxTextField={estiloLaberBuenMalEstado('#3ba352')}
            />
          </Grid>
        )}

        {userLogin?.Parametros?.tiene_inventario_kit && (
          <Grid item lg={userLogin?.Parametros?.tiene_multi_inventarios ? 12 : 6}
            xs={12} m
            d={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb'
              }}
            >
              <FormGroup
                sx={{
                  textAlign: 'center',
                  alignItems: 'center'
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isKit}
                      onChange={CheckIsKit}
                    />
                  }
                  label="ES KIT ?"
                />

                {isKit && (
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="estado-kit-label">ESTADO DEL KIT</InputLabel>
                    <Select
                      labelId="estado-kit-label"
                      id="estado-kit"
                      label="ESTADO DEL KIT"
                      fullWidth
                      value={estadoKit}
                      sx={{ width: '100%' }}
                      onChange={(e) => handleKitStateChange(e.target.value)}
                    >
                      <MenuItem value={0}>-- ESTADO --</MenuItem>
                      <MenuItem value="COMPLETO">COMPLETO</MenuItem>
                      <MenuItem value="INCOMPLETO">INCOMPLETO</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </FormGroup>
            </Box>
          </Grid>

        )}


        {isKit && (
          <Grid item lg={6} sm={12} xs={12}>
            <TextField
              fullWidth
              id="observacion-kit"
              label="ESCRIBIR OBSERVACIÓN KIT..."
              placeholder="Escribir...."
              multiline
              disabled={activarObservacionesKit}
              rows={4}
              variant="standard"
              value={observacionesKit}
              onChange={(e) => setObservacionesKit(e.target.value)}
              sx={{
                display: activarObservacionesKit !== true ? 'block' : 'none',
                p: 2,
                borderRadius: 2,
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb'
              }}
            />
          </Grid>

        )}


        <Grid item lg={12} sm={12} xs={12}>
          <Divider
            sx={{
              mt: 0,
              '&::before, &::after': {
                borderColor: '#d1d5db'
              }
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: '#374151',
                letterSpacing: 0.2,
                fontSize: '14px'
              }}
            >
              OBSERVACIONES
            </Typography>
          </Divider>
        </Grid>

        <Grid item lg={12} sm={12} xs={12}>
          <Box>


            <TextField
              fullWidth
              id="observacion-general"
              placeholder="Ingrese información adicional sobre el producto..."
              multiline
              minRows={3}
              maxRows={5}
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              disabled={
                userLogin?.Parametros?.tiene_habilitado_observacion_inventario
              }
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  p: 0,
                  borderRadius: 2.5,
                  backgroundColor: '#ffffff',
                  transition: 'all 0.2s ease',

                  '& fieldset': {
                    borderColor: '#dce3ec',
                    transition: 'all 0.2s ease'
                  },

                  '&:hover': {
                    backgroundColor: '#fbfdff'
                  },

                  '&:hover fieldset': {
                    borderColor: '#94a3b8'
                  },

                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.10)'
                  },

                  '&.Mui-focused fieldset': {
                    borderWidth: '1px',
                    borderColor: '#1e3a8a'
                  },

                  '&.Mui-disabled': {
                    backgroundColor: '#f1f5f9'
                  }
                },

                '& .MuiInputBase-inputMultiline': {
                  p: '12px 14px',
                  fontSize: '13px',
                  lineHeight: 1.55,
                  color: '#1e293b'
                },

                '& .MuiInputBase-inputMultiline::placeholder': {
                  fontSize: '12.5px',
                  color: '#94a3b8',
                  opacity: 1
                },

                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#94a3b8'
                }
              }}
            />

            <Typography
              sx={{
                mt: 0.6,
                fontSize: 11,
                color: '#94a3b8'
              }}
            >
              Añada únicamente información relevante para el inventario.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} textAlign={'end'}>
          <Button
            variant="contained"
            onClick={grabarItem}
            sx={{
              borderRadius: 5,
              backgroundColor: '#1f6feb',
              boxShadow: 4,
              height: 37,
              '&:hover': {
                backgroundColor: '#1a5fd0',
                boxShadow: 6
              }
            }}
          >
            GRABAR
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default InventarioCiegoCompoenent