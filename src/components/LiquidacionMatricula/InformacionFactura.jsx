

import React, { useEffect } from 'react'
import Logo from '../../assets/images/Logo.png'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { GET_REVISION_MOTO, GET_INFORMACION_GARANTIA_MOTO, UPDATE_EMAIL, UPDATE_TELEFONO } from '../../services/Aura_Api'
import { Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import UpdateIcon from '@mui/icons-material/Update';
import { showAlert } from '@/utils/modalAlerts';
import { useLoading } from '@/componentesCommons/LoadingContext';
// import '../css/AuraPage.css'

const InformacionFactura = (props) => {
    const { setNumeroFacturaGrabar, setNumeroIdentificacion, setramv, numeroFacturaGrabar } = props
    const [numeroFactura, setNumeroFactura] = React.useState("")
    const [telefono, setTelefono] = React.useState("")
    const [email, setEmail] = React.useState("")
    const { startLoading, stopLoading } = useLoading();
    const informacionGrarantiaEncerrado = {
        "id": "080e43e2-98cd-4831-ba10-f8d91c136197",
        "marca": "",
        "primermantenimientogarantia": "0",
        "ultimomantenimientogarantia": "0",
        "intervalokmgarantia": "0",
        "numeromantenimientogarantia": "0",
        "tiempomesesmotorchasis": "0",
        "recorridokmmotorchasis": "0",
        "tiempomesessiselec": "0",
        "kilometrajekmsiselec": "0",
        "tiempocomponentemeca": "0",
        "kilometrajecomponentemeca": "0"
    }
    const [informacionGarantia, setInformacionGarantia] = React.useState(informacionGrarantiaEncerrado)

    const informacionFacturaEncerrado = {
        "cod_fecha": "",
        "cod_mes": "",
        "cod_compania": "",
        "motc_catven": "",
        "motc_origen": 0,
        "motc_tipo_doc": "",
        "motc_n_documento": "",
        "motc_cod_producto": "",
        "motc_des_producto": "",
        "motc_cod_marca": "",
        "marca_motos": "",
        "motc_cod_fiscal": "",
        "motc_cod_cliente": "",
        "motc_des_cliente": "",
        "motc_clt_ciudad": "",
        "motc_clt_direccion": "",
        "motc_clt_email": "",
        "motc_clt_telefono": "",
        "motc_cod_punto_fact": "",
        "motc_des_punto_fact": "",
        "motc_cod_vendedor": "",
        "motc_des_vendedor": "",
        "motc_unidades": 0,
        "motc_ing_bruto": 0,
        "motc_descuentos": 0,
        "motc_ing_neto": 0,
        "total_factura": 0,
        "motc_costo": 0,
        "motc_ice": "",
        "motc_utilidad": 0,
        "mottran_estado": "",
        "compania_cliente": "",
        "motc_cod_proveedor": "",
        "motc_des_proveedor": "",
        "motc_plazo": 0,
        "cliente_grupo": "",
        "motc_estado_matriculacion": "",
        "motc_estado_fisico": "",
        "motc_politica": "",
        "motc_anio": "",
        "motc_color": "",
        "motc_forma_pago": "",
        "motc_entrada": 0,
        "motc_chasis": "",
        "motc_motor": "",
        "motc_ramv": "",
        "motc_usuario_oracle": "",
        "fecha_venta": "",
        "motc_clt_fecha_nacimiento": "",
        "motc_clt_sexo": "",
        "motc_mpago_cobro": "",
        "motc_tcre_tc": "",
        "motc_banc_emi_tc": ""
    }
    const [infomoto, setInfoMoto] = React.useState(informacionFacturaEncerrado);

    const update_email_correo = (e, tipo) => {
        e.preventDefault()
        let result = ""
        const functionThatReturnPromise = async () => {
            try {
                if (tipo === "email") {
                    const respuesta = await UPDATE_EMAIL(infomoto.motc_n_documento, telefono, infomoto.motc_cod_cliente, email);
                }
                if (tipo === "telefono") {
                    const respuesta = await UPDATE_TELEFONO(infomoto.motc_n_documento, telefono, infomoto.motc_cod_cliente, email);
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
                        return "SE ACTUALIZO CORRECTAMENTE"
                    },
                    icon: "🟢",
                    position: toast.POSITION.TOP_CENTER
                },
                error: {
                    render({ data }) {
                        return `${data}`
                    },
                    icon: '🔴',
                    position: toast.POSITION.TOP_CENTER
                }
            }
        );

    }
    
    useEffect(() => {
        if(numeroFacturaGrabar){
            startLoading();
            setNumeroFactura(numeroFacturaGrabar)
            buscarFactura(numeroFacturaGrabar)
            stopLoading();
        }
    }, [])

    const buscarFactura = async(facturaBuscar = null) =>{
            try {
                const respuesta = await GET_REVISION_MOTO(facturaBuscar ?? numeroFactura);
                if (respuesta.length !== 0) {
                    setInfoMoto(respuesta[0])
                    const informacionGarantia = await GET_INFORMACION_GARANTIA_MOTO(respuesta[0].marca_motos);
                    setInformacionGarantia(informacionGarantia[0])
                    setNumeroIdentificacion(respuesta[0].motc_cod_cliente)
                    setTelefono(respuesta[0].motc_clt_telefono)
                    setEmail(respuesta[0].motc_clt_email)
                    setNumeroFacturaGrabar(respuesta[0].motc_n_documento)
                    setramv(respuesta[0].motc_ramv)
                } else {
                    setInfoMoto(informacionFacturaEncerrado)
                    setInformacionGarantia(informacionGrarantiaEncerrado)
                    setNumeroIdentificacion("")
                    setTelefono("")
                    setEmail("")
                    throw "NO EXISTE LA FACTURA"
                }

            } catch (error) {
                 const configAlert = {
                    title: "ERROR",
                    message: `Se Presento el siguiente error. <strong>${error}</strong>`,
                    type: 'error',
                    callBackFunction: false,
                };
                showAlert(configAlert);
            }
    }
    
    const buscarMotoXDocumento = async (e) => {
        e.preventDefault()
        let result = ""
        buscarFactura();
    }

    return (
        <div>
            <ToastContainer />
            <Box sx={{
                flexGrow: 1,
                paddingRight: 8,
                paddingLeft: 8,
                paddingTop: 3
            }}>
                <p style={{
                    color: '#FFE516',
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginTop: 0,
                    marginBottom: 0,
                    textShadow: '2px 1px 2px rgba(0, 0, 0, 0.5)'
                }}>DATOS DE FACTURA</p>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Número de Factura
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            value={numeroFactura}
                            disabled
                            onChange={(e) => setNumeroFactura(e.target.value)} />
                        <SearchIcon onClick={(e) => buscarMotoXDocumento(e)} disabled/>
                        <Button onClick={(e) => buscarMotoXDocumento(e)} variant='contained' disabled> consultar</Button>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Fecha de Factura
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            fullWidth
                            disabled
                            value={(infomoto.fecha_venta !== "" ? infomoto.fecha_venta : "")} />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6} style={{ display: 'none' }}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Ciudad de Facturacion
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            value={infomoto.motc_clt_ciudad}
                            variant="standard"
                            disabled
                            fullWidth />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Organizacion
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            fullWidth
                            disabled
                            value={infomoto.motc_des_punto_fact.split("-")[2]}
                            variant="standard" />
                    </Grid>

                </Grid>
                {/* Segunda Fila */}
                <Grid container
                    spacing={2}
                    marginTop={2}>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Vendedor
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            fullWidth
                            disabled
                            value={infomoto.motc_des_vendedor} />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Codigo Cliente
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            value={infomoto.motc_cod_cliente}
                            fullWidth
                            disabled
                            variant="standard" />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Nombre de Cliente
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            disabled
                            value={infomoto.motc_des_cliente}
                            variant="standard"
                            fullWidth />
                    </Grid>


                </Grid>

                {/* Tercera Fila */}
                <Grid container spacing={2} marginTop={2}>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Celular
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            className='TextfieldEneable'
                            value={telefono}
                            fullWidth
                            disabled
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                        <UpdateIcon className='iconoBotton'
                            onClick={(e) => update_email_correo(e, "telefono")}></UpdateIcon>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Correo Electronico
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            value={email}
                            disabled
                            onChange={(e) => setEmail(e.target.value)}
                            variant="standard"
                            className='TextfieldEneable' />
                        <UpdateIcon className='iconoBotton' onClick={(e) => update_email_correo(e, "email")}></UpdateIcon>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Tipo de venta
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            value={infomoto.motc_mpago_cobro}
                            disabled
                            fullWidth />
                    </Grid>
                    <Grid item xs={12} md={8} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Direccion
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            fullWidth
                            variant="standard"
                            disabled
                            value={infomoto.motc_clt_direccion} />
                    </Grid>

                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Plazo
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            disabled
                            value={infomoto.motc_plazo}
                            fullWidth />
                    </Grid>
                </Grid>

                <p style={{
                    color: '#FFE516',
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginTop: 30,
                    marginBottom: 10,
                    textShadow: '2px 1px 2px rgba(0, 0, 0, 0.5)'
                }}>Motoclicleta</p>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Codigo de Producto
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            className='Textfield'
                            disabled
                            value={infomoto.motc_cod_producto} />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Marca
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            disabled
                            className='Textfield'
                            value={infomoto.marca_motos} />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Modelo
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            className='Textfield'
                            disabled
                            value={infomoto.motc_des_producto} />
                    </Grid>

                </Grid>
                {/* Segunda Fila */}
                <Grid container spacing={2} marginTop={2}>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Color
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            className='Textfield'
                            disabled
                            value={infomoto.motc_color} />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Chasis
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            className='Textfield'
                            disabled
                            value={infomoto.motc_chasis} />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            RAMV
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            className='Textfield'
                            disabled
                            value={infomoto.motc_ramv} />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Año
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            className='Textfield'
                            disabled
                            value={infomoto.motc_anio} />
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default InformacionFactura