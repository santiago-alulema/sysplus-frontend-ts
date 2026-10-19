import { Box, Button, Card, CardContent, Divider, Grid, Stack, TextField, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import NavbarMasterMoto from '../components/NavbarMasterMoto';
import {CONSULTAR_VALORES_CARTERA} from '../services/Service_Api_Cartera'

const ReporteCartera = () => {
    const [numeroDocumento, setNumeroDocumento] = useState("")
    const[total, setTotal] = useState(0.0)
    const [dataCartera, setDataCartera] = useState({
        "valor_vencido_dia": 0.0,
        "int_mora": 0.0,
        "g_cobranza": 0.0,
        "Total": 0
    })

    const consultaReporte = async(e) => {
        e.preventDefault()
        if  (numeroDocumento.trim() ===""){
            return toast.warn("PORFAVOR INGRESE EL NUMERO DE DOCUMENTO", { position: toast.POSITION.TOP_CENTER })
        }

        const functionThatReturnPromise = async () => {
            try {
                const response = await CONSULTAR_VALORES_CARTERA(numeroDocumento);
                if (response.length > 0){
                    setDataCartera(response[0])
                    const valorTotal = response[0].valor_vencido_dia + response[0].g_cobranza + response[0].int_mora
                    setTotal(valorTotal)
                }
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
                        return "DESCARGANDO REPORTE"
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
            <NavbarMasterMoto titulo="REPORTE DE CARTERA" />
            <Box component="fieldset" pt={4} pb={4} pl={2} pr={2} >
                <legend>REPORTE</legend>
                <ToastContainer />
                <Stack spacing={{ xs: 1, sm: 2 }} justifyContent="center" alignItems="center">

                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} fullWidth width='100%' style={{ width: '100%' }}>
                        <Typography variant="h6" fontWeight="bold"  > INGRESE NUMERO DE DOCUMENTO</Typography>
                        <TextField id="filled-basic" label="Documento" variant="filled" width='90%' onChange={(e) => setNumeroDocumento(e.target.value)}/>
                        <Button variant="contained"  minWidth={250} pl={2} pr={2}
                                onClick={(e) => consultaReporte(e)}
                                size="large">
                                    Visualizar
                        </Button>
                    </Stack>

                    <Card sx={{ minWidth: 275 }} elevation={5} >
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item sx={12} sm={12}>
                                    <Stack direction="row"
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        fullWidth width='100%'
                                        style={{ width: '100%' }}>
                                        <Typography variant="h7" minWidth={150}
                                            fontWeight="bold" >VALOR DIAS VENCIDO</Typography>
                                        <TextField
                                            disabled
                                            id="outlined-disabled"
                                            label="VALOR"
                                            defaultValue="0"
                                            value={dataCartera.valor_vencido_dia}
                                            inputProps={{ style: { textAlign: 'right' } }}
                                        />
                                    </Stack>

                                </Grid>
                                <Grid item sx={12} sm={12}>
                                    <Stack direction="row"
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        fullWidth 
                                        width='100%'
                                        style={{ width: '100%' }}>
                                        <Typography variant="h6" 
                                                    fullWidth
                                                    fontWeight="bold" minWidth={160}> VALOR MORA</Typography>
                                        <TextField
                                            disabled
                                            id="outlined-disabled"
                                            label="VALOR"
                                            
                                            defaultValue="0"
                                            value={dataCartera.int_mora}
                                            inputProps={{ style: { textAlign: 'right' } }}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item sx={12} sm={12}>
                                    <Stack direction="row"
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        fullWidth 
                                        width='100%'
                                        style={{ width: '100%' }}>
                                        <Typography variant="h6"
                                                    minWidth={150}
                                                    fontWeight="bold"  >G. COBRANZA</Typography>
                                        <TextField
                                            disabled
                                            id="outlined-disabled"
                                            label="VALOR"
                                            defaultValue="0"
                                            value={dataCartera.g_cobranza}
                                            inputProps={{ style: { textAlign: 'right' } }}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item sx={12} sm={12}>
                                    <Divider sx={{ borderStyle: 'dashed', borderWidth: '3px', fontWeight: 'bold', borderColor:'black'}} />
                                    <br></br>
                                    <Stack direction="row"
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        fullWidth width='100%'
                                        style={{ width: '100%' }}>
                                        <Typography variant="h6"
                                                    minWidth={150}
                                                    fontWeight="bold" > TOTAL</Typography>
                                        <TextField
                                            disabled
                                            id="outlined-disabled"
                                            label="VALOR"
                                            defaultValue="0"
                                            value={total}
                                            inputProps={{ style: { textAlign: 'right' } }}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    {/* <Stack
                        direction="row"
                        spacing={2}
                        style={{ width: '100%' }}>
                        <Button variant="contained" 
                                fullWidth
                                onClick={(e) => consultaReporte(e)}>
                                    Vizualizar
                        </Button>
                    </Stack> */}
                </Stack>
            </Box>
        </>

    )
}

export default ReporteCartera