import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import CabeceraInventario from './components/CabeceraInventario.jsx';
import ConfirmDialog from '../../components/TomaInventarioFisicoComp/ConfirmDialog.jsx';
import InventarioCabeceraHook from './hooks/InventarioCabeceraHook.js';
import agenciaVaciaImage from '@/assets/images/agencia_vacia.png';
import InventarioCiegoItem from './hooks/InventarioCiegoItem.jsx';
import { TaskAltRounded, WarningAmberRounded } from '@mui/icons-material';

const InventarioCiego = () => {
  const cabecera = InventarioCabeceraHook();

  const {
    agencuasUsuarios,
    seleccionarAgencia,
    seleccionarAgenciaYJefeAgencia,
    objectAgencia,
    selectNameAgencia,
    userLogin,
    obtenerUsuario,
    openFinishAuditory,
    setOpenFinishAuditory,
    confirmInventoryFinish,
    cancelConfirmInventoryFinish
  } = cabecera;

  const tieneMultiInventarios =
    userLogin?.Parametros?.tiene_multi_inventarios ?? false;

  const cantidadInventarios = tieneMultiInventarios
    ? userLogin?.Parametros?.cantidad_multi_inventario ?? 1
    : 1;

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        py: 3,
        backgroundColor: '#f4f6f8'
      }}
    >
      <ConfirmDialog
        title={`Desea finalizar el inventario de la agencia: ${selectNameAgencia.trim().length === 0 ||
          selectNameAgencia.trim() === '-- SELECT --'
          ? 'SIN AGENCIA SELECCIONADA'
          : selectNameAgencia
          }`}
        functionConfirm={confirmInventoryFinish}
        functionCancel={cancelConfirmInventoryFinish}
        setOpen={setOpenFinishAuditory}
        open={openFinishAuditory}
      />

      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{
          width: '100%',
          px: { xs: 1.5, md: 2 }
        }}>
       { ["nancysamaniego", "ligiaparedes", "nancysamaniegouc", "ligiaparedesuc"].includes(!userLogin?.User ? "test" : userLogin?.User) && (
         <Paper
          elevation={0}
          sx={{
            width: '100%',
            mx: 'auto',
            mt: 2,
            px: { xs: 2, md: 2.5 },
            py: 1.5,
            borderRadius: 2.5,
            border: '1px solid #fbbf24',
            backgroundColor: '#fffbeb',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  color: '#92400e',
                  backgroundColor: '#fef3c7',
                }}
              >
                <WarningAmberRounded sx={{ fontSize: 24 }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#78350f',
                  }}
                >
                  Precaución al finalizar
                </Typography>

                <Typography
                  sx={{
                    mt: 0.2,
                    fontSize: 12.5,
                    color: '#92400e',
                    lineHeight: 1.45,
                  }}
                >
                  Una vez finalizado, el inventario no podrá modificarse ni
                  reversarse.
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="text"
              startIcon={<TaskAltRounded />}
              onClick={() => setOpenFinishAuditory(true)}
              sx={{
                minWidth: { xs: '100%', md: 210 },
                height: 40,
                px: 2.5,
                borderRadius: 2,
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                color: '#ffffff',
                backgroundColor: '#e68943 !important',
                boxShadow: 'none',

                '&:hover': {
                  backgroundColor: '#92400e !important',
                  boxShadow: 'none',
                },
              }}
            >
              Finalizar inventario
            </Button>
          </Stack>
        </Paper>

       )
        
       }

        <CabeceraInventario
          seleccionarAgencia={seleccionarAgencia}
          seleccionarAgenciaYJefeAgencia={seleccionarAgenciaYJefeAgencia}
          agencuasUsuarios={agencuasUsuarios}
          userLogin={userLogin}
          objectAgencia={objectAgencia}
        />

        <Box
          component="img"
          src={agenciaVaciaImage}
          alt="Agencia no seleccionada"
          sx={{
            p: 2,
            width: { xs: '85%', sm: '65%', md: '45%', lg: '35%' },
            maxWidth: 520,
            objectFit: 'contain',
            display: seleccionarAgencia === '0' ? 'block' : 'none'
          }}
        />

        <Grid container spacing={1} sx={{ width: '100%' }}>
          {Array.from({ length: cantidadInventarios }).map((_, index) => (
            <Grid
              item
              key={`inventario-ciego-${index}`}
              xs={12}
              sm={12}
              md={12}
              lg={
                !tieneMultiInventarios && cantidadInventarios == 1
                  ? 12
                  : 6
              }
            >
              <InventarioCiegoItem
                userLogin={userLogin}
                seleccionarAgencia={seleccionarAgencia}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default InventarioCiego;