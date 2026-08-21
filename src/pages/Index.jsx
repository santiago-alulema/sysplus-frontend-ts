import { Box, CssBaseline } from '@mui/material';
import login from '../assets/images/login.jpg';
import Login from '../components/Login';
import UpdatePassword from '@/components/UpdatePassword';
import { useState } from 'react';

export const Index = () => {

  const[usuario, setUsuario] = useState(null);



  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          width: '100vw',
          height: '100vh',

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          backgroundImage: `
            linear-gradient(
              rgba(10, 15, 30, 0.45),
              rgba(10, 15, 30, 0.60)
            ),
            url(${login})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            mx: 2,
            p: {
              xs: 3,
              sm: 4,
            },

            borderRadius: 4,

            background: 'rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',

            border: '1px solid rgba(255, 255, 255, 0.15)',

            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          }}
        >

          {(!usuario && !usuario?.DebeCambiarPassword) && (<Login usuario={usuario} setUsuario={setUsuario}/>)}
          {( usuario?.DebeCambiarPassword) && (<UpdatePassword usuario={usuario} setUsuario={setUsuario}/>)}

          
        </Box>
      </Box>
    </>
  );
};