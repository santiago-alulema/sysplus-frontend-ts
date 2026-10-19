import { Box, Button, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import PagosLiquidacionComponente from './PagosLiquidacionComponente';
import { ToastContainer, toast } from 'react-toastify';
import { SEARCH_ANTICIPO } from '../../services/AnticiposMatricula'
import Liquidacion from '../../Models/ValorLiquidacion';
import Modal from '@mui/material/Modal';
import Logo from '../../assets/images/Logo.png'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { SUBIR_IMAGENES_LIQUIDACION, GRABAR_LIQUIDACION, DESCARGAR_DOCUMENTO_LIQUIDACION, DESCARGAR_DOCUMENTO_ACTA_ENTREGA_VEHICULO } from '../../services/LiquidacionApis'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Zoom from 'react-medium-image-zoom'
import { showAlert } from '@/utils/modalAlerts';
import { Decrypt_User } from '@/services/Storage_Service';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const LiquidacionMatriculaComponente = (props) => {

    const [valoresLiquidacion, setValoresLiquidacion] = React.useState({
        Placas: new Liquidacion('PLACAS', 0, null),
        ImpuestosMunicipales: new Liquidacion('IMPUESTOS MUNICIPALES', 0, null),
        ImpuestosProvinciales: new Liquidacion('IMPUESTOS PROVINCIALES', 0, null),
        RodajeMunicipal: new Liquidacion('RODAJE MUNICIPAL', 0, null),
        RodajeProvincial: new Liquidacion('RODAJE PROVINCIAL', 0, null),
        RevicionVehicular: new Liquidacion('REVICION VEHICULAR', 0, null),
        Stiker: new Liquidacion('STIKER', 0, null),
        CertificadoNoAdeudar: new Liquidacion('CERTIFICDO NO ADEUDAR', 0, null),
        PagosExtraordinarios: new Liquidacion('PAGOS EXTRAORDINARIOS', 0, null),
        AdicionalValorFactura: new Liquidacion('ADICIONAL POR VALOR DE FACTURA', 0, null),
        GestorVarios: new Liquidacion('GESTOR VARIOS', 0, null),
    })


    const anticipoEncerado = {
        codAnticipoAura: "",
        ciudadMatriculacion: "",
        gestMatricula: "",
        valorTotalMatric: 0,
        pagosextraordinarios: 0
    }


    const { numeroIdentificacion, numeroFacturaGrabar, ramv, setKeyComponent } = props
    const [codigoAnticipo, setCodigoAnticipo] = useState("")
    const [valorExtraordinario, setValorExtraordinario] = useState(0)
    const [imgPlaca, setImgPlaca] = useState(null)
    const [imgEspecie, setImgEspecie] = useState(null)

    const [open, setOpen] = useState(false);
    const [codigoGeneradoLiquidacion, setCodigoGeneradoLiquidacion] = useState("")
    const [anticipo, setAnticipo] = useState(anticipoEncerado)
    const [modificacion, setmodificcion] = useState(0)
    const [totalPagado, setTotalPagado] = useState(0)

   
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };


    function showPromiseToast(promiseFunction, options) {
        return toast.promise(promiseFunction, options);
    }

    useEffect(() => {
        if(!!numeroFacturaGrabar){
            buscarAnticipoGeneral(numeroFacturaGrabar)
            setCodigoAnticipo(numeroFacturaGrabar)
        }
    }, [])
    
    const buscarAnticipoGeneral = async (codigoAnticipoParametro = null) =>{

        if ( (!codigoAnticipoParametro?.length ?? codigoAnticipo.trim().length ) === 0) {
            return toast.warn("INGRESE UN CODIGO DE ANTICIPO", { position: toast.POSITION.TOP_CENTER });
        }

        if (numeroIdentificacion.trim().length === 0) {
            return toast.warn("BUSQUE UN NUMERO LA FACTURA", { position: toast.POSITION.TOP_CENTER });
        }
        try {
            const respuesta = await SEARCH_ANTICIPO(codigoAnticipoParametro ?? codigoAnticipo, numeroIdentificacion, numeroFacturaGrabar);
            if (respuesta.length > 0) {
                setAnticipo(respuesta[0]);
                //valoresLiquidacion.PagosExtraordinarios.valor = respuesta[0].pagosextraordinarios
                setValoresLiquidacion(valoresLiquidacion)
               // anticipo.pagosextraordinarios = respuesta[0].pagosextraordinarios
              //  setValorExtraordinario(respuesta[0].pagosextraordinarios)
                calcularTotal()
            } else {
                setAnticipo(anticipoEncerado);
                const configAlert = {
                                    title: "ERROR",
                                    message: "NO SE ENCONTRARON RESULTADOS: EL ANTICIPO NO PERTENECE A ESE CLIENTE, YA FUE ATENDIDO, O NO EXISTE",
                                    type: 'error',
                                    callBackFunction: false,
                                };
                showAlert(configAlert);
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

    const buscar_Anticipo = (e) => {
        e.preventDefault();
        buscarAnticipoGeneral();
    }

    const handleFileChange = (e, tipo) => {
        const file = e.target.files[0];
        if (file) {
            switch (tipo) {
                case "ESPECIE":
                    setImgEspecie(file)
                    break
                case "PLACA":
                    setImgPlaca(file)
                    break
            }
        }
    };

    const alertasMensajes  =(mensaje) =>{
        let configAlert = {
            title: "ERROR",
            message: mensaje,
            type: 'error',
            callBackFunction: false,
        };
        showAlert(configAlert);

    } 
    const Grabar_Liquidacion = async (e) => {
        let total = 0;
        let mensaje = "";
        e.preventDefault()
        if (anticipo.codAnticipoAura.trim() === "") {
            mensaje = "NO HA BUSCADO UN ANTICIPO"
            alertasMensajes(mensaje);
            return 
        }
        if (totalPagado > anticipo.valorTotalMatric) {
            mensaje = "EL VALOR TOTAL PAGADO DEBE SER MENOR O IGUAL A TOTAL MATRICULACION"
            alertasMensajes(mensaje);
            return 
        }
        // if (imgEspecie === null) {
        //     mensaje = "SUBA LA IMAGEN DE LA ESPECIE DE MATRICULA"
        //     alertasMensajes(mensaje);
        //     return 
        // }
        // if (imgPlaca === null) {
        //     mensaje = "SUBA LA IMAGEN DE LA PLACA METALICA"
        //     alertasMensajes(mensaje);
        //     return 
        // }
        let verificarValor = 0
        for (const key in valoresLiquidacion) {
            if (valoresLiquidacion.hasOwnProperty(key)) {
                const liquidacion = valoresLiquidacion[key];
                    if (liquidacion.valor > 0 && liquidacion.file === null) {
                        return toast.warn("PORFAVOR VERIFIQUE QUE TODOS LOS VALORES TENGAN SUS RESPECTIVAS IMAGENES", { position: toast.POSITION.TOP_CENTER });
                    }
                        verificarValor += liquidacion.valor
            }
        }
        verificarValor += anticipo.pagosextraordinarios
        if (verificarValor === 0) {
            return toast.warn("EL VALOR DE LA LIQUIDACION DEBE SER MAYOR A CERO", { position: toast.POSITION.TOP_CENTER });

        }

        const functionThatReturnPromise = async () => {
            try {
                await grabarLiquidacion();
                await enviar_imagenes();
                if(imgPlaca){
                    await enviar_imagenes_INDIVIDUAL(imgPlaca, anticipo.codAnticipoAura, "IMAGEN PLACA METALICA");
                }
                if(imgEspecie){
                    await enviar_imagenes_INDIVIDUAL(imgEspecie, anticipo.codAnticipoAura, "IMAGEN PLACA ESPECIE MATRICULA");
                }
                
                setOpen(true)
            } catch (error) {
                throw error;
            }
        };

        showPromiseToast(functionThatReturnPromise, {
            pending: {
                render({ data }) {
                    return "CONSULTANDO ..."
                },
                position: toast.POSITION.TOP_CENTER
            },
            success: {
                render({ data }) {
                    return "DESPLEGANDO INFORMACION"
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
        });

    }

    const grabarLiquidacion = async () => {
        const user = Decrypt_User();
        let New_Liquidacion = {
            codfactura: numeroFacturaGrabar,
            ramv: ramv,
            codAnticipo: anticipo.codAnticipoAura,
            placa: valoresLiquidacion.Placas.valor.toString(),
            impuestosMunicipales: valoresLiquidacion.ImpuestosMunicipales.valor.toString(),
            impuestosProvinciales: valoresLiquidacion.ImpuestosProvinciales.valor.toString(),
            rodajeMunicipal: valoresLiquidacion.RodajeMunicipal.valor.toString(),
            rodajeProvincial: valoresLiquidacion.RodajeProvincial.valor.toString(),
            revicionVehicular: valoresLiquidacion.RevicionVehicular.valor.toString(),
            sticker: valoresLiquidacion.Stiker.valor.toString(),
            certificadoNoAdeuda: valoresLiquidacion.CertificadoNoAdeudar.valor.toString(),
            pagosExtraordinarios:valoresLiquidacion.PagosExtraordinarios.valor.toString()  ,
            adicionalValorFactura: valoresLiquidacion.AdicionalValorFactura.valor.toString(),
            gestorVarios: valoresLiquidacion.GestorVarios.valor.toString(),
            gestorGraba: user.User
        }

        const resp = await GRABAR_LIQUIDACION(New_Liquidacion);
        setCodigoGeneradoLiquidacion(resp.cod_Liquidacion)
    }


    const enviar_imagenes = async () => {
        for (const key in valoresLiquidacion) {
            if (valoresLiquidacion.hasOwnProperty(key)) {
                const liquidacion = valoresLiquidacion[key];
                if (liquidacion.file !== null && liquidacion.file !== undefined) {
                    await SUBIR_IMAGENES_LIQUIDACION(liquidacion.file, anticipo.codAnticipoAura, liquidacion.tipoLiquidacion);
                }
            }
        }
    }

    const enviar_imagenes_INDIVIDUAL = async (file, codAnticipoAura, tipo) => {
       await SUBIR_IMAGENES_LIQUIDACION(file, codAnticipoAura, tipo);
    }

    const calcularTotal = () => {
       valorExtraordinario ?? setValorExtraordinario(0);

        let total = 0;
        for (const key in valoresLiquidacion) {
             if (valoresLiquidacion.hasOwnProperty(key)) {
                const liquidacion = valoresLiquidacion[key];
                 total =total+ parseFloat(liquidacion.valor) ;
             }
        }
         total = (Math.round(total * 100) / 100)+Number(valorExtraordinario);

        setTotalPagado(total)
    }

    const descargarDocumentoLiquidacion = (e) => {
        e.preventDefault() 
        DESCARGAR_DOCUMENTO_LIQUIDACION(codigoGeneradoLiquidacion,"NOTALL")
        DESCARGAR_DOCUMENTO_ACTA_ENTREGA_VEHICULO(ramv)
        setOpen(false)
        setKeyComponent(Math.floor(Math.random() * 100))

    }

    useEffect(() => {
        calcularTotal()
    }, [valoresLiquidacion, totalPagado, modificacion, setmodificcion]);


     
    const modalDocumentoAnticipo = () => {
        return (<div>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 5 }}>
                        <img src={Logo}
                            width={120}
                            height={80}
                            alt='logo de la empresa master moto'></img>
                    </div>
                    <Typography id="modal-modal-title" variant="h6" component="h2" align='center' color='black'>
                        CODIGO LIQUIDACION: {codigoGeneradoLiquidacion}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Button variant="contained"
                            fullWidth
                            onClick={(e) => descargarDocumentoLiquidacion(e)}
                        >DESCARGAR COMPROBANTE</Button>
                    </Typography>
                </Box>
            </Modal>
        </div>)
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
                }}>Liquidacion de Anticipo de Matricula</p>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Codigo de Anticipo
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            value={codigoAnticipo}
                            onChange={(e) => setCodigoAnticipo(e.target.value)} disabled/>
                        <SearchIcon onClick={(e) => buscar_Anticipo(e)} disabled />
                        <Button onClick={(e) => buscar_Anticipo(e)} variant='contained' disabled> consultar</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Total Matriculacion
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            disabled
                            value={anticipo.valorTotalMatric} />
                    </Grid>
                    <Grid item xs={3}>
                        <p style={{
                            paddingBottom: 0,
                            marginBottom: 0
                        }}>
                            Total Pagado
                        </p>
                        <TextField id="standard-basic"
                            label=""
                            variant="standard"
                            disabled
                            value={totalPagado} />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item sx={11} md={6}>
                        <div>
                            <p style={{
                                paddingBottom: 0,
                                marginBottom: 0
                            }}>
                                Ciudad Matriculacion
                            </p>
                            <TextField id="standard-basic"
                                label=""
                                variant="standard"
                                disabled
                                style={{ width: '70%' }}
                                value={anticipo.ciudadMatriculacion}
                            />
                        </div>
                        <div>
                            <p style={{
                                paddingBottom: 0,
                                marginBottom: 0
                            }}>
                                Gestor Matriculacion
                            </p>
                            <TextField id="standard-basic"
                                label=""
                                variant="standard"
                                disabled
                                style={{ width: '70%' }}
                                value={anticipo.gestMatricula}
                            />
                        </div>
                        <br />
                        {/* anticipo.codAnticipoAura */}
                        {"a" === ""
                            ? ""
                            : (
                            <Card sx={{width: '85%',  backgroundColor: '#c2c5cb' }}>
                                <CardHeader
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center' }}
                                    title="SUBIR IMAGENES E INFORMACION ADICIONAL"
                                    subheader="SON OBLIGATORIAS"
                                />
                                <CardContent>
                                    <div>
                                        <Button component="label"
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            fullWidth
                                            paddingBottom={15}
                                            onChange={(e) => handleFileChange(e, "PLACA")}
                                        >
                                            Subir imagen PLACA METALICA
                                            <VisuallyHiddenInput type="file" accept="image/*" />
                                        </Button>
                                        <div style={{ display: 'flex', justifyContent: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                            {
                                                imgPlaca === null
                                                    ?
                                                    ""
                                                    :
                                                    <Zoom>
                                                        <img style={{ width: '30%' }} src={URL.createObjectURL(imgPlaca)} alt={imgPlaca.name}></img>
                                                    </Zoom>
                                            }

                                        </div>
                                    </div>
                                    <br />
                                    <div>
                                        <Button component="label"
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            fullWidth
                                            onChange={(e) => handleFileChange(e, "ESPECIE")}
                                        >
                                            Subir imagen ESPECIE DE MATRICULA
                                            <VisuallyHiddenInput type="file" accept="image/*" />
                                        </Button>

                                        <div style={{ display: 'flex', justifyContent: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                            {
                                                imgEspecie === null
                                                    ?
                                                    ""
                                                    :
                                                    <Zoom >
                                                        <img style={{ width: '30%', textAlign: 'center' }} src={URL.createObjectURL(imgEspecie)} alt={imgEspecie}></img>
                                                    </Zoom>
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        <div style={{ paddingTop: 15 }}>
                            <Button variant="contained"
                                style={{ width: '80%' }}
                                onClick={(e) => Grabar_Liquidacion(e)}>Liquidar Anticipo</Button>
                        </div>
                    </Grid>
                    <Grid item sx={12} md={6}>
                        <PagosLiquidacionComponente pagosExtraordinario={anticipo.pagosextraordinarios} setmodificcion={setmodificcion} valoresLiquidacion={valoresLiquidacion} setValoresLiquidacion={setValoresLiquidacion} />
                    </Grid>
                </Grid>
            </Box>
            {modalDocumentoAnticipo()}
        </div>
    )
}

export default LiquidacionMatriculaComponente