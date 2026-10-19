import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { DESCARGAR_DOCUMENTO_LIQUIDACION } from '../services/LiquidacionApis'
import { Decrypt_User } from '../services/Storage_Service'
const ReImprimirLiquidacion = () => {
    const [numeroDocumento, setNumeroDocumento] = useState("")
    const [userLogin, setUserLogin] = React.useState({});
    const OnInitPage = async () => {
        const user = Decrypt_User();
        setUserLogin(user)
      }

      useEffect(() => {
        OnInitPage()
      }, []);

    const descargarReporteCobros = async (e) => {
        e.preventDefault()
        const functionThatReturnPromise = async () => {
            try {
                 await DESCARGAR_DOCUMENTO_LIQUIDACION(numeroDocumento, userLogin.OrganizationName);
            } catch (error) {
                throw error;
            }
        };
        toast.promise(
            functionThatReturnPromise,
            {
                pending: {
                    render({ data }) {
                        return "CONSULTANDO ..."
                    },
                    position: toast.POSITION.TOP_CENTER
                },
                success: {
                    render({ data }) {
                        return "DESCARGANDO DOCUMENTO"
                    },
                    icon: "🟢",
                    position: toast.POSITION.TOP_CENTER
                },
                error: {
                    render({ data }) {
                        return data
                    },
                    icon: '🔴',
                    position: toast.POSITION.TOP_CENTER
                }
            }
        );
    }


    return (
        <>
            <ToastContainer />
            <Box component="fieldset" pt={2} pb={4} pl={2} pr={2}>
                <legend>RE-IMPRIMIR DOCUMETO LIQUIDACION</legend>

                <Stack direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    fullWidth
                    style={{ width: '100%' }}>
                    <Typography variant="h6"
                        fontWeight="bold"> INGRESE NUMERO DE LIQUIDACION</Typography>
                    <TextField id="filled-basic"
                        label="Documento"
                        fullWidth
                        variant="filled"
                        onChange={(e) => setNumeroDocumento(e.target.value)} />
                </Stack>
                <Button
                    variant="contained"
                    minWidth={350}
                    sx={{  marginTop: 3 }}
                    fullWidth
                    size="large"
                    onClick={(e) => descargarReporteCobros(e)}>
                    GENERAR DOCUMENTO
                </Button>
            </Box>
        </>
    )
}

export default ReImprimirLiquidacion