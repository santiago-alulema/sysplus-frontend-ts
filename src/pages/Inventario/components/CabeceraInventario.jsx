import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import {
  AdminPanelSettingsOutlined,
  BusinessOutlined,
  CalendarMonthOutlined,
  Inventory2Outlined,
  LocationOnOutlined,
  PersonOutline,
} from '@mui/icons-material';

import dayjs from 'dayjs';
import 'dayjs/locale/es';

const CabeceraInventario = ({
  seleccionarAgencia,
  seleccionarAgenciaYJefeAgencia,
  agencuasUsuarios,
  userLogin,
  objectAgencia,
}) => {
  const fechaFormateada = dayjs()
    .locale('es')
    .format('dddd, D [de] MMMM [de] YYYY');

  const fechaActual =
    fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

  return (
    <Paper
      elevation={0}
      sx={{
        width:'100%',
        mt: 2,
        mx: 1.5,
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid #dce3ea',
        backgroundColor: '#ffffff',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.10)',
        fontFamily: '"Nunito Sans", "Roboto", sans-serif',
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 1.5,
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          color: '#ffffff',
          background:
            'linear-gradient(110deg, #0f2942 0%, #183d5d 60%, #0f766e 140%)',
        }}
      >
        <Stack direction="row" spacing={1.4} alignItems="center">
          <Box
            sx={{
              width: 38,
              height: 38,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <Inventory2Outlined sx={{ fontSize: 22 }} />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: 15, md: 16 },
                fontWeight: 700,
                lineHeight: 1.2,
                color: 'white'
              }}
            >
              Información del inventario
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: 12,
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              Datos de la agencia y responsables
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={0.8}
          alignItems="center"
          sx={{
            px: 1.4,
            py: 0.7,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.16)',
          }}
        >
          <CalendarMonthOutlined sx={{ fontSize: 16 }} />

          <Typography
            sx={{
              fontSize: 12.5,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              color: 'white'
            }}
          >
            {fechaActual}
          </Typography>
        </Stack>
      </Box>

      {/* Información */}
      <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
        <Grid container spacing={{ xs: 2, md: 0 }} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <InfoItem
              icon={<BusinessOutlined />}
              label="Empresa"
              value={objectAgencia?.empresa ?? ""}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <InfoItem
              icon={<PersonOutline />}
              label="Usuario responsable"
              value={userLogin?.Name || 'Sin usuario'}
              divider
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <InfoItem
              icon={<AdminPanelSettingsOutlined />}
              label="Jefe de agencia"
              value={objectAgencia?.jefeagencia || 'Sin asignar'}
              divider
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                pl: { xs: 0, md: 2.5 },
                borderLeft: {
                  xs: 'none',
                  md: '1px solid #e2e8f0',
                },
              }}
            >
              <Stack direction="row" spacing={1.3} alignItems="center">
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    color: '#0f766e',
                    backgroundColor: '#ecfdf5',
                  }}
                >
                  <LocationOnOutlined sx={{ fontSize: 19 }} />
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      mb: 0.45,
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: '#64748b',
                    }}
                  >
                    Agencia seleccionada
                  </Typography>

                  <FormControl fullWidth size="small">
                    <Select
                      value={seleccionarAgencia || ''}
                      onChange={seleccionarAgenciaYJefeAgencia}
                      displayEmpty
                      sx={{
                        height: 36,
                        borderRadius: 2,
                        fontFamily: 'inherit',
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#0f2942',
                        backgroundColor: '#f8fafc',

                        '& .MuiSelect-select': {
                          py: 0.7,
                        },

                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#cbd5e1',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#0f766e',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderWidth: 1.5,
                          borderColor: '#0f766e',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Seleccione una agencia
                      </MenuItem>

                      {agencuasUsuarios?.map((item) => (
                        <MenuItem
                          key={item.idagencia}
                          value={item.idagencia}
                          sx={{
                            fontFamily: '"Nunito Sans", "Roboto", sans-serif',
                            fontSize: 14,
                          }}
                        >
                          {item.nombreagencia}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

const InfoItem = ({ icon, label, value, divider = false }) => {
  return (
    <Box
      sx={{
        pr: { xs: 0, md: 2.5 },
        pl: {
          xs: 0,
          md: divider ? 2.5 : 0,
        },
        borderLeft: {
          xs: 'none',
          md: divider ? '1px solid #e2e8f0' : 'none',
        },
      }}
    >
      <Stack direction="row" spacing={1.3} alignItems="center">
        <Box
          sx={{
            width: 34,
            height: 34,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            color: '#1d4f75',
            backgroundColor: '#eff6ff',

            '& svg': {
              fontSize: 19,
            },
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              mb: 0.25,
              fontSize: 11.5,
              fontWeight: 600,
              color: '#64748b',
              lineHeight: 1.2,
            }}
          >
            {label}
          </Typography>

          <Typography
            title={value}
            sx={{
              fontSize: 14,
              fontWeight: 700,
              color: '#172033',
              lineHeight: 1.35,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default CabeceraInventario;