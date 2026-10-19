import { Box, Button, Grid, Paper, TextField, Typography, IconButton } from '@mui/material'
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
import { GET_ALL_SOLICITUDES_APROPIACION, SAVE_SOLICITUDES_APROPIACION } from '../../services/Api_BodegaConsignacion/Api_BodegaConsignacion'
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import AddTaskIcon from '@mui/icons-material/AddTask';

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


const SolicitudApropiacion = () => {

    const productoencerado = {
        codigoproducto: "",
        tt_detallepedidocompra_id: "",
        tt_pedidocompra_id: "",
        cantidad: "0",
        costo_unitario: "0",
        descripcion: "",
        descripcion_attributos: "",
        producto: "",
        proveedor: "",
        ad_org_id: "",
        nameAgency: "",
        nameagencyorig: ""
    }


    const [solicitudesApropiacion, setSolicitudesApropiacion] = useState([])
    const [open, setOpen] = React.useState(false);
    const [numeroCotizacion, setNumeroCotizacion] = useState("")
    const [productoApropiacion, setProductoApropiacion] = useState(productoencerado)
    const [userLogin, setUserLogin] = React.useState({});
    const [parameterSearch, setParameterSearch] = useState("")
    const [enableButtonApropiacion, setEnableButtonApropiacion] = useState(false)

    const handleOpen = (item) => {
        setProductoApropiacion(item)
        setOpen(true)

    };
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
        fetchData();
    }, []);


    const fetchData = async () => {
        try {

            const usuario = await OnInitPage();
            if (usuario.OrganizationId !== undefined) {
                const respuesta = await GET_ALL_SOLICITUDES_APROPIACION(usuario.OrganizationId, parameterSearch);
                setSolicitudesApropiacion(respuesta)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const saveApropiacion = () => {
        if (numeroCotizacion.trim() === "") {
            return toast.warn("EL NUMERO DE COTIZACION NO PUEDE SER VACIO.", { position: toast.POSITION.TOP_CENTER })
        }
        const functionThatReturnPromise = async () => {
            setEnableButtonApropiacion(true)

            try {
                const enviarApropiacion = {
                    idDetalleCompra: productoApropiacion.tt_detallepedidocompra_id,
                    usuario: userLogin.User,
                    bodegaDestino: productoApropiacion.ad_org_id,
                    numerocotizacion: numeroCotizacion
                }
                await SAVE_SOLICITUDES_APROPIACION(enviarApropiacion);
                if (userLogin.OrganizationId !== undefined) {
                    const respuesta = await GET_ALL_SOLICITUDES_APROPIACION(userLogin.OrganizationId);
                    setSolicitudesApropiacion(respuesta)
                }
                setOpen(false)
                setNumeroCotizacion("")
                setEnableButtonApropiacion(false)
            } catch (error) {
                throw error;
            }
        };
        manejoMensajes(functionThatReturnPromise, "CARGANDO ....")
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

    const styleCell = (width = 80) => {
        return {
            width: width,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    }

    const tableResult = () => {
        return (<TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center"></StyledTableCell>
                        <StyledTableCell align="center" sx={styleCell(50)}>COD. PRODUCTO</StyledTableCell>
                        <StyledTableCell align="center" sx={styleCell(120)}>PRODUCTO</StyledTableCell>
                        <StyledTableCell align="center">PROVEEDOR</StyledTableCell>
                        <StyledTableCell align="center" style={{ display: 'none' }}>COSTO UNITARIO</StyledTableCell>
                        <StyledTableCell align="center" >ATRIBUTO</StyledTableCell>
                        <StyledTableCell align="center" sx={styleCell(150)}>BOD. ORIG.</StyledTableCell>
                        <StyledTableCell align="center" sx={styleCell(150)}>BOD. DEST.</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {solicitudesApropiacion.map((row, index) => (
                        <TableRow key={row.name}>
                            <TableCell scope="row">
                                <IconButton color="primary" onClick={(e) => handleOpen(row)}>
                                    <AddTaskIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell align="right">{row.codigoproducto}</TableCell>
                            <TableCell align="right">{row.producto}</TableCell>
                            <TableCell align="right">{row.proveedor}</TableCell>
                            <TableCell align="right" style={{ display: 'none' }}>{row.costo_unitario}</TableCell>
                            <TableCell align="right">{row.descripcion_attributos.replace("_"," ")}</TableCell>
                            <TableCell align="right">{row.nameagencyorig}</TableCell>
                            <TableCell align="right">{row.nameagency}</TableCell>
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
                    <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                        Numero de Cotizacion :
                    </Typography>
                    <TextField
                        label="INGRESO # COTIZACION "
                        fullWidth
                        onChange={(e) => setNumeroCotizacion(e.target.value)}
                    />
                    <Button sx={{
                        marginTop: '12px',
                    }} variant="contained"
                        disabled={enableButtonApropiacion}
                        fullWidth onClick={saveApropiacion}> SOLICITAR APROPIACION </Button>
                </Box>
            </Modal>
            <ToastContainer />
            <NavbarMasterMoto titulo="APROPIACION DE PRODUCTOS" />
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
                    <SearchBlobal parameterSearch={parameterSearch} setParameterSearch={setParameterSearch} functionExecute={fetchData} />
                    {solicitudesApropiacion.length === 0 ? null : tableResult()}

                </Paper>
            </Box>

        </>
    )
}

export default SolicitudApropiacion