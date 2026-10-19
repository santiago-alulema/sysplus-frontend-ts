import { Box, Button, Grid, Paper, TextField, Typography, IconButton, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NavbarMasterMoto from '../../components/NavbarMasterMoto'
import SearchBlobal from '../../components/SearchBlobal'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { Decrypt_User } from '../../services/Storage_Service'
import { GET_ALL_SOLICITUDES_APROPIACION_X_APROBAR, APROVAR_RECHAZAR_SOLICITUD_APROPIACION } from '../../services/Api_BodegaConsignacion/Api_BodegaConsignacion'
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ErrorIcon from '@mui/icons-material/Error';
import Tooltip from '@mui/material/Tooltip';
import SearchAgencia from '../../components/SearchAgencia';
import { manejoMensajes } from '../../helpers/ManejoExcepciones.js'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 750,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const ControlMasterSolicitudApropiacion = () => {

    const productoencerado = {
        tt_detallepedidocompra_id: "",
        tt_pedidocompra_id: "",
        cantidad: "0",
        costo_unitario: "0",
        descripcion: "",
        descripcion_attributos: "",
        producto: "",
        proveedor: "",
        ad_org_id: "",
        numero_cotizacion: "",
        tt_solicitud_apropiacion_id: "",
        nameagency:"",
        nameagencyorig:"",
        fechapedido:""
    }


    const [solicitudesApropiacion, setSolicitudesApropiacion] = useState([])
    const [open, setOpen] = React.useState(false);
    const [codAgencia, setCodAgencia] = React.useState("");
    const [numeroCotizacion, setNumeroCotizacion] = useState("")
    const [productoApropiacion, setProductoApropiacion] = useState(productoencerado)
    const [userLogin, setUserLogin] = React.useState({});
    const [parameterSearch, setParameterSearch] = React.useState("");

    const handleOpen = (item) => {
        setProductoApropiacion(item)
        setOpen(true)

    };

    const searchAprovacion = ()=>{
        fetchData();
    }

    const handleClose = () => {
        setProductoApropiacion(productoencerado)
        setOpen(false)
    };



    const OnInitPage = async () => {
        const user = await Decrypt_User();
        if (user === null) {
            return;
        }
        setUserLogin(user)
        return user
    }

    useEffect(() => {
       
        manejoMensajes(fetchData, "Consultando...")
        // fetchData();
    }, []);


    const fetchData = async () => {
        try {
            OnInitPage()
            const respuesta = await GET_ALL_SOLICITUDES_APROPIACION_X_APROBAR(codAgencia, parameterSearch);
            setSolicitudesApropiacion(respuesta)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const uploadSolicitudApropiacion = (estado, idSolicitud) => {
        const functionThatReturnPromise = async () => {
            try {
                await APROVAR_RECHAZAR_SOLICITUD_APROPIACION(userLogin.User, estado, idSolicitud);
                const respuesta = await GET_ALL_SOLICITUDES_APROPIACION_X_APROBAR(codAgencia, parameterSearch);
                setSolicitudesApropiacion(respuesta)
            } catch (error) {
                throw error;
            }
        };
        let mensajeEstado = "ANULACION"
        if (estado ==="P"){
            mensajeEstado = "APROBACION"
        }
        manejoMensajes(functionThatReturnPromise, `SE REALIZO LA ACCION DE ${mensajeEstado} SATISFACTORIAMENTE  `)
    }


    const manejoMensajes = (funcion, mensaje) => {
        toast.promise(
            funcion,
            {
                pending: {
                    render({ data }) {
                        return "CONSULTANDO ..."
                    },
                    position: toast.POSITION.TOP_CENTER
                },
                success: {
                    render({ data }) {
                        return mensaje
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

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#ffe800",
            color: "#171718",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
        '&.customWidth': {
            width: '12px',  // Ajusta el ancho según tus necesidades
        },
    }));


    const tableResult = () => {
        return (<TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">SELECCIONAR</StyledTableCell>
                        <StyledTableCell align="center">PRODUCTO</StyledTableCell>
                        <StyledTableCell align="center">PROVEEDOR</StyledTableCell>
                        <StyledTableCell align="center">CANTIDAD</StyledTableCell>
                        <StyledTableCell align="center">COSTO UNITARIO</StyledTableCell>
                        <StyledTableCell align="center">ATRIBUTO</StyledTableCell>
                        <StyledTableCell align="center"># COTIZACION</StyledTableCell>
                        <StyledTableCell align="center">AGENCIA ORIGEN</StyledTableCell>
                        <StyledTableCell align="center">AGENCIA DESTINO</StyledTableCell>
                        <StyledTableCell align="center">FECHA PEDIDO</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {solicitudesApropiacion.map((row, index) => (
                        <TableRow key={row.name}>
                            <TableCell scope="row">
                                <Stack direction="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={2}>
                                    <Tooltip title="APROBAR SOLICITUD">
                                        <IconButton aria-label="add" onClick={(e => uploadSolicitudApropiacion("P", row.tt_solicitud_apropiacion_id))}>
                                            <CheckBoxIcon color='success' style={{ fontSize: '40px' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="CANCELAR SOLICITUD">
                                        <IconButton aria-label="delete" onClick={(e => uploadSolicitudApropiacion("N", row.tt_solicitud_apropiacion_id))}>
                                            <ErrorIcon color='error' style={{ fontSize: '40px' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </TableCell>
                            <TableCell align="right">{row.producto}</TableCell>
                            <TableCell align="right">{row.proveedor}</TableCell>
                            <TableCell align="right">{row.cantidad}</TableCell>
                            <TableCell align="right">{row.costo_unitario}</TableCell>
                            <TableCell align="right">{row.descripcion_attributos}</TableCell>
                            <TableCell align="right">{row.numero_cotizacion}</TableCell>
                            <TableCell align="right">{row.nameagencyorig}</TableCell>
                            <TableCell align="right">{row.nameagency}</TableCell>
                            <TableCell align="right">{row.fechapedido}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>)
    }


    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" textAlign='center' component="h2">
                        INGRESE INFORMACION PARA LA SOLICITUD DE APROPIACION
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                        PPRODUCTO :  {productoApropiacion.producto}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                        ATRIBUTO :  {productoApropiacion.descripcion_attributos}
                    </Typography>
                    <Typography  id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                        Numero de Cotizacion :
                    </Typography>
                    <TextField
                        label="INGRESO # COTIZACION "
                        fullWidth
                        onChange={(e) => setNumeroCotizacion(e.target.value)}
                    />
                    <Button > SOLICITAR APROPIACION </Button>
                </Box>
            </Modal>
            <ToastContainer />
            <NavbarMasterMoto titulo="CONTROL MASTER SOLICITUDES DE CREDITO" />
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                        m: 1,
                        width: '100%',
                        height: '100%',
                    },
                }}
            >

                <Paper elevation={3}
                    style={{
                        marginRight: 20,
                        marginLeft: 20,
                        paddingTop: 20,
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingBottom: 20
                    }}>

                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                           Seleccionar Agencia Destino:  <SearchAgencia  setCodAgencia={setCodAgencia}
                                style={{ marginLeft: '2', width: '100%' }} ></SearchAgencia>
                        </Grid>
                        <Grid item sm={6}>
                            Buscar valor de atributo
                            <SearchBlobal style={{ width: '100%' }} parameterSearch={parameterSearch} 
                                                                    setParameterSearch={setParameterSearch}  
                                                                    functionExecute={searchAprovacion}  />
                        </Grid>
                    </Grid>
                </Paper>
                {solicitudesApropiacion.length === 0 ? null : tableResult()}
            </Box>

        </>
    )
}

export default ControlMasterSolicitudApropiacion