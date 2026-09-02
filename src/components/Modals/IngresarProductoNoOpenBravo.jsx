import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Divider,InputLabel,Select, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Paper, RadioGroup, Stack, TextField } from '@mui/material';
import { grabar_auditoria_item } from '../../services/AuditoriaInventario_Api.js'
import { manejoMensajes } from '../../helpers/ManejoExcepciones.js'
import { toast } from 'react-toastify';
import { SAVE_PRODUCT_INVENTORY } from '../../services/Api_Inventario/Api_TomaFisicaInventario.js'
import { TomaFisicaProducto } from '../TomaInventarioFisicoComp/class/TomaFisicaProducto.js';
import DescripcionItem from '../AuditoriaStock/DescripcionItem.jsx';
import { SelectSINO } from '../AuditoriaStock/SelectSINO.jsx';


import Radio from '@mui/material/Radio';
import { Height } from '@mui/icons-material';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    maxHeight: '90%', // Limita la altura máxima del modal
    overflowY: 'auto', // Permite el scroll vertical
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const IngresarProductoNoOpenBravo = ({ open, setOpen, titulo, mensaje, user, codigoAgencia, tipoTomaInventario }) => {
    const handleClose = () => setOpen(false);
    const [cantidad, setCantidad] = useState("1")
    const [descripcion, setDescripcion] = useState("")
    const [motor, setMotor] = useState("")
    const [chasis, setChasis] = useState("")
    const [color, setColor] = useState("")
    const [observacion, setObservacion] = useState("")
    const [llaves, setllaves] = useState(0)
    const [manual, setmanual] = useState(0)
    const [baterias, setbaterias] = useState(0)
    const [herramientas, setherramientas] = useState(0)
    const [retrovisores, setretrovisores] = useState(0)
    const [apoyaPies, setapoyaPies] = useState(0)
    const [portaPlacas, setportaPlacas] = useState(0)
    const [portaMaleteros, setportaMaleteros] = useState(0)
    const [aguaBateria, setaguaBateria] = useState(0)
    const [isConsignado, setIsConsignado] = useState(0)
    const [counterComponent, setCounterComponent] = useState(new Date().getTime())
    const [organizations, setOrganizations] = useState([]);
    const [typeDamageMotocycle, setTypeDamageMotocycle] = useState(0)
    const [typeSelectionMotoCount, setTypeSelectionMotoCount] = useState(0)
    const valuesNull = ["N/A", "0", "", "null", undefined]
    const [blockSectionKits, setBlockSectionKits] = useState(false)
    const [selectedKitMoto, setSelectedKitMoto] = useState(0)
    const [cantidadBuenEstado, setCantidadBuenEstado] = useState(0)
    const [cantidadMalEstado, setCantidadMalEstado] = useState(0)
    const [codProducto, setCodProducto] = useState("")


    const haveAllKitMoto = (havekit) => {
        setBlockSectionKits(havekit)
        setllaves(havekit ? 1 : 0)
        setmanual(havekit ? 1 : 0)
        setbaterias(havekit ? 1 : 0)
        setherramientas(havekit ? 1 : 0)
        setretrovisores(havekit ? 1 : 0)
        // setapoyaPies(havekit ? 1 : 0)
        // setportaPlacas(havekit ? 1 : 0)
        // setportaMaleteros(havekit ? 1 : 0)
        // setaguaBateria(havekit ? 1 : 0)
    }

    const resetComponentes = () => {
        setllaves(0)
        setmanual(0)
        setbaterias(0)
        setherramientas(0)
        setretrovisores(0)
        setapoyaPies(0)
        setportaPlacas(0)
        setportaMaleteros(0)
        setaguaBateria(0)
    }

    const validarSelectVacios = () => {
        if (llaves === 0 ||
            manual === 0 ||
            baterias === 0 ||
            herramientas === 0 ||
            retrovisores === 0 ||
            apoyaPies === 0 ||
            portaPlacas === 0 ||
            portaMaleteros === 0 ||
            aguaBateria === 0
        ) {
            return true
        }
        return false
    }

    const getCountGoodOrBatStatus = (value) => {
        if (value !== 2) {
            setTypeDamageMotocycle(0)
        }
        if ( value !== undefined) {
            setTypeSelectionMotoCount(value)
            setCantidadBuenEstado(value === 1 ? 1 : 0);
            setCantidadMalEstado(value === 2 ? 1 : 0);
        }
    }

    const validarSelectMalEstado = () => {
        const variables = [
            llaves,
            manual,
            baterias,
            herramientas,
            retrovisores,
            apoyaPies,
            portaPlacas,
            portaMaleteros,
            aguaBateria
        ];
        const valoresAValidar = ['2', '3'];
        return variables.some(variable => valoresAValidar.includes(variable));
    };
    const grabarItem = () => {

        if (codigoAgencia === "" || codigoAgencia === 0 || codigoAgencia === "0")
            return toast.warn("DEBE SELECCIONAR UNA AGENCIA", { position: toast.POSITION.TOP_CENTER })
        if (motor.trim() === "" || chasis.trim() === "" ||  descripcion.trim() === ""  || color.trim() === "")
            return toast.warn("TODOS LOS CAMPOS SON OBLIGATORIOS", { position: toast.POSITION.TOP_CENTER })
        if (parseInt(cantidad) === 0)
            return toast.warn("LA CANTIDAD DEL PRODUCTO NO PUEDE SER CERO", { position: toast.POSITION.TOP_CENTER })
        const isSelectCorrect = validarSelectVacios()
        if (isSelectCorrect && tipoTomaInventario == "2" ) {
            return toast.warn("PORFAVOR REVISE QUE LOS KIT O VARIOS DE LA MOTO NO ESTE VACIO", { position: toast.POSITION.TOP_CENTER })
        }
        if (validarSelectMalEstado() && (observacion === "" || observacion === undefined)) {
            return toast.warn("KIT O VARIOS EN ESTADO DAÑANO O FALTANTE, ESCRIBA UNA OBSERVACION", { position: toast.POSITION.TOP_CENTER })
        }
        
        if (typeSelectionMotoCount === 0 ) {
            return toast.warn("POR FAVOR ELEIJA EL ESTADO DEL ITEM", { position: toast.POSITION.TOP_CENTER })
        }

        if (typeSelectionMotoCount === 2 && typeDamageMotocycle === 0  ) {
            return toast.warn("ELIJA EL TIPO DE DAÑO DE LA MOTO", { position: toast.POSITION.TOP_CENTER })
        }

        const idOperacion = crypto.randomUUID();

        const tomaFisicaProducto = new TomaFisicaProducto(
            codProducto,
            descripcion,
            String(cantidadBuenEstado ?? "0"),
            String(cantidadMalEstado ?? "0"),
            String(motor),
            String(chasis),
            String(llaves ?? "0"),
            String(manual ?? "0"),
            String(baterias ?? "0"),
            String(herramientas ?? "0"),
            String(retrovisores ?? "0"),
            String(apoyaPies ?? "0"),
            String(portaPlacas ?? "0"),
            String(portaMaleteros ?? "0"),
            String(aguaBateria ?? "0"),
            String(observacion),
            String("0"),
            String(parseInt(cantidad)),
            String(color),
            String("0"),
            String(generarCodigo()),
            String(user),
            String(codigoAgencia),
            "SIN LOCALIZACION",
            String(typeDamageMotocycle),
            "",
            "",
            "",
            "",
            0,
            idOperacion
        );
        const functionThatReturnPromise = async () => {
            try {
                await SAVE_PRODUCT_INVENTORY(tomaFisicaProducto)
                setDescripcion("");
                setMotor("");
                setChasis("");
                setColor("");
                setObservacion("");
                resetComponentes();
                setOrganizations([]);
                setSelectedKitMoto(null);
                setCantidadBuenEstado(0);
                setCantidadMalEstado(0);
                setTypeDamageMotocycle(0);
                getCountGoodOrBatStatus(0);
                setCounterComponent(new Date().getTime())
            } catch (error) {
                throw error;
            }
        };
        manejoMensajes(functionThatReturnPromise, "SE GRABO CORRECTAMENTE")
    }

    function generarCodigo() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
        const longitud = 36;
        let codigoGenerado = '';

        for (let i = 0; i < longitud; i++) {
            const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
            codigoGenerado += caracteres.charAt(indiceAleatorio);
        }

        return codigoGenerado;
    }
    
    const setCountProduct = (e) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, '');
        if (inputValue === "") {
            setCantidad(0)
        } else {
            setCantidad(parseInt(inputValue));
        }
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
                    <Typography textAlign='center'
                        id="modal-modal-title"
                        variant="h6"
                        component="h2">
                        {titulo}
                    </Typography>
                    <Grid container spacing={3} >
                        <Grid item sm={12}>
                            <Divider>INFORMACION PRODUCTO</Divider>
                        </Grid>
                        <Grid item sm={6}>
                            <TextField id="CANTIDAD"
                                label="CANTIDAD"
                                variant="outlined"
                                value={cantidad}
                                onChange={(e) => setCountProduct(e)}
                                fullWidth
                                disabled />
                        </Grid>
                        <Grid item sm={6}>
                            {tipoTomaInventario == "1" ? (
                                <TextField id="DESCRIPCION"
                                    label="DESCRIPCION"
                                    variant="outlined"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    fullWidth />) : (
                                        
                                <DescripcionItem key={counterComponent}
                                                 organizations={organizations} // Estado de organizaciones
                                                 setOrganizations={setOrganizations} 
                                                 setDescriptionProduct={setDescripcion}
                                                 setCodProducto={setCodProducto}
                                                 categoria='MOTOS' />
                            )}
                        </Grid>
                        <Grid item sm={12}>
                            <Divider>LLENAR SI ES MOTO</Divider>
                        </Grid>
                        <Grid item sm={6}>
                            <TextField id="MOTOR"
                                label="MOTOR"
                                variant="outlined"
                                value={motor}
                                onChange={(e) => setMotor(e.target.value)}
                                fullWidth />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField id="CHASIS"
                                label="CHASIS"
                                variant="outlined"
                                value={chasis}
                                onChange={(e) => setChasis(e.target.value)}
                                fullWidth />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField id="COLOR"
                                label="COLOR"
                                variant="outlined"
                                value={color.toUpperCase()}
                                onChange={(e) => setColor(e.target.value)}
                                fullWidth />
                        </Grid>
                        <Grid item md={6}>
                                <FormControl sx={{ width: '100%', marginTop: '15px' }}  >
                                    <InputLabel id="demo-simple-select-label">ESTADO MOTO</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Age"
                                        value={typeSelectionMotoCount}
                                        onChange={(e) => getCountGoodOrBatStatus(e.target.value)}
                                    >
                                        <MenuItem value={0}>-- ESTADO --</MenuItem>
                                        <MenuItem value={1}>BUEN ESTADO</MenuItem>
                                        <MenuItem value={2}>MAL ESTADO</MenuItem>

                                    </Select>
                                </FormControl>
                                {typeSelectionMotoCount === 2 ?
                                    <FormControl sx={{ width: '100%', marginTop: '15px' }}  >
                                        <InputLabel id="demo-simple-select-label">TIPO DE DAÑO</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="DamageMotocycle"
                                            value={typeDamageMotocycle}
                                            onChange={(e) => setTypeDamageMotocycle(e.target.value)}
                                        >
                                            <MenuItem value={0}>-- SELECCIONE --</MenuItem>
                                            <MenuItem value={1}>RAYADO</MenuItem>
                                            <MenuItem value={2}>GOLPEADO</MenuItem>
                                            <MenuItem value={3}>ROTO</MenuItem>
                                            <MenuItem value={4}>INCOMPLETO</MenuItem>
                                            <MenuItem value={5}>DAÑO EN LA MOTO</MenuItem>
                                        </Select>
                                    </FormControl>
                                    :
                                    null
                                }
                            </Grid>
                        
                        <Grid item sm={12} sx={{display: (tipoTomaInventario == "1" ? "none":"block")}}>
                            <Paper elevation={3}
                                style={{
                                    marginTop: 10,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    width: '100%',
                                    textAlign: 'center',

                                    // pointerEvents: producto.motor === "" ? 'none' : ''
                                }}>
                                <Divider>ACCESORIOS PRODUCTO</Divider>
                                <Stack direction='column' spacing={2}>
                                    <FormControl sx={{ display: 'none' }}>
                                        <FormLabel id="group-radio-isproduct" sx={{ textAlign: 'left' }}>EL PRODUCTO ES:</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="group-radio-isproduct"
                                            name="row-radio-buttons-group"
                                            value={isConsignado}
                                            onChange={(e) => setIsConsignado(e.target.value)}
                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="Consignado" />
                                            <FormControlLabel value="2" control={<Radio />} label="Propio" />
                                        </RadioGroup>
                                    </FormControl>
                                    <Divider />
                                    <FormControl mt={2}>
                                        <FormLabel id="goup-label-kit" sx={{ textAlign: 'left' }}>KIT DE LA MOTO:</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="goup-label-kit"
                                            name="row-radio-buttons-group"
                                            value={selectedKitMoto}
                                            onChange={(e) => setSelectedKitMoto(e.target.value)}
                                        >
                                            <FormControlLabel value="1" control={<Radio />} onClick={(e) => haveAllKitMoto(true)} label="Todo" />
                                            <FormControlLabel value="2" control={<Radio />} onClick={(e) => haveAllKitMoto(false)} label="Manual" />
                                        </RadioGroup>
                                    </FormControl>
                                    <Divider />
                                </Stack>
                                <Grid container spacing={5} mt={1} mb={5} sx={{ pointerEvents: blockSectionKits ? 'none' : '' }}>
                                    <Grid item md={2}>
                                        <SelectSINO titulo='LLAVE'
                                            setSelect={setllaves}
                                            itemSelect={llaves}></SelectSINO>
                                    </Grid>
                                    <Grid item md={2}>
                                        <SelectSINO titulo='MANUAL'
                                            setSelect={setmanual}
                                            itemSelect={manual} />
                                    </Grid>
                                    <Grid item md={2}>
                                        <SelectSINO titulo='BATERIA' setSelect={setbaterias} itemSelect={baterias} />
                                    </Grid>
                                    <Grid item md={3}>
                                        <SelectSINO titulo='HERRAMIENTAS'
                                            setSelect={setherramientas}
                                            itemSelect={herramientas}></SelectSINO>
                                    </Grid>
                                    <Grid item md={3}>
                                        <SelectSINO titulo='RETROVISORES'
                                            setSelect={setretrovisores}
                                            itemSelect={retrovisores}></SelectSINO>
                                    </Grid>
                                </Grid>
                                <Divider>VARIOS</Divider>
                                {/* sx={{ pointerEvents: blockSectionKits ? 'none' : '' }} */}
                                <Grid container spacing={2} mt={1} >
                                    <Grid item md={3}>
                                        <SelectSINO titulo='APOYA PIES'
                                            setSelect={setapoyaPies}
                                            itemSelect={apoyaPies}></SelectSINO>
                                    </Grid>
                                    <Grid item md={3}>
                                        <SelectSINO titulo='PORTA PLACAS'
                                            setSelect={setportaPlacas}
                                            itemSelect={portaPlacas}></SelectSINO>
                                    </Grid>
                                    <Grid item md={3}>
                                        <SelectSINO titulo='PORTA-MALETEROS'
                                            setSelect={setportaMaleteros}
                                            itemSelect={portaMaleteros}></SelectSINO>
                                    </Grid>
                                    <Grid item md={3}>
                                        <SelectSINO titulo='AGUA-BATERIA'
                                            setSelect={setaguaBateria}
                                            itemSelect={aguaBateria}></SelectSINO>
                                    </Grid>
                                </Grid>
                            </Paper>

                        </Grid>
                        <Grid item sm={12}>
                            <Divider>OBSERVACIONES</Divider>
                        </Grid>
                        <Grid item sm={12}>
                            <TextField fullWidth
                                // sx={{ display: selectObservacion === "1" ? "" : "none", marginTop: '15px' }}
                                id="standard-textarea"
                                label="ESCRIBIR OBSERVACION ..."
                                placeholder="Escribir...."
                                multiline
                                rows={4}
                                variant="standard"
                                value={observacion}
                                onChange={(e) => setObservacion(e.target.value)}
                            />
                        </Grid>
                        
                        <Grid item sm={12}>
                            <Button variant="contained"
                                size='large'
                                fullWidth
                                onClick={grabarItem}>GRABAR ITEM</Button>
                        </Grid>

                    </Grid>
                </Box>
            </Modal>
        </>
    )
}

export default IngresarProductoNoOpenBravo



