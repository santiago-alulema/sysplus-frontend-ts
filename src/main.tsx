import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   // <-- importa BrowserRouter
import { AuthProvider } from '@/Context/AuthContext'
import './themes/global.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './helpers/TypeThemes'
import AppRoutes from './helpers/AppRoutes'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from '@/utils/dayjs-setup'
import '@/config/axiosToken.config';
import { LoadingContextProvider } from './componentesCommons/LoadingContext'
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="es"
      dateLibInstance={dayjs}  // usa tu instancia con tz
    >
      <LoadingContextProvider>
    <BrowserRouter>                      
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
    </LoadingContextProvider>
    </LocalizationProvider>
  </React.StrictMode>
)
