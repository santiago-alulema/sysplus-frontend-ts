

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';
import '../../pages/css/UploadExcelListPrice.css';
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Paper, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import NavbarMasterMoto from '../../components/NavbarMasterMoto.jsx';
import { Decrypt_User } from '../../services/Storage_Service.js'
import { useNavigate } from 'react-router-dom';
import { manejoMensajes } from '../../helpers/ManejoExcepciones.js'
import { UPLOAD_DATA_MODEL_PROVEEDOR, UPLOAD_DATA_PRODUCT_COST } from '../../services/Api_BodegaConsignacion/Api_BodegaConsignacion.js'
import { ToastContainer, toast } from 'react-toastify';
import excel_image from '../../assets/images/excel_image.png'
const UploadExcelProvedor_BC = () => {
    let navigate = useNavigate();
    // const [excelData, setExcelData] = useState([]);
    const [DataFacturas, setDataFacturas] = useState([]);
    const [numberRows, setNumberRows] = useState(0);
    const [numberColumn, setNumberColumn] = useState(0);
    const [fileName, setFileName] = useState("");
    const [nameListPrice, setNameListPrice] = useState("");
    const [userLogin, setUserLogin] = React.useState({});
    const [uploadedFile, setUploadedFile] = React.useState(null);
    const [typeUploadLabel, setTypeUploadLabel] = React.useState("");

    const handleFileUpload = (acceptedFiles) => {
        const fileReader = new FileReader();
        const file = acceptedFiles[0];
        setFileName(file.name)

        fileReader.onload = (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            const range = XLSX.utils.decode_range(worksheet['!ref']);
            setNumberRows(range.e.r - range.s.r + 1);
            setNumberColumn(range.e.c - range.s.c + 1);



            const excel = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setDataFacturas(transformToCustomObjects(excel));
        };
        setUploadedFile(acceptedFiles[0]);
        fileReader.readAsBinaryString(acceptedFiles[0]);
    };

    const transformToCustomObjects = (excelData) => {
        const transformedData = excelData.slice(1).map((row) => {
            return createData(...row);
        });

        return transformedData;
    };

    function createData(...args) {
        let newObject = {}
        if (value === 'pv') {
            newObject = {
                cod_producto: args[0],
                cod_provedor: args[1] 
            };
        }
        if (value === 'pc') {
            newObject = {
                fecha_inicio: TransfDate(args[0]),
                fecha_final: TransfDate(args[1]),
                cod_provedor: args[2].toString(),
                cod_producto: args[3].toString(),
                cost: args[4].toString(),
                user_create: userLogin.User
            };
        }
        return newObject;
    }


    const TransfDate = (serial) => {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        const jsDate = new Date(excelEpoch.getTime() + serial * 86400000);
        return formatDate(jsDate);
    }

    function formatDate(date) {
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    const OnInitPage = async () => {
        const user = Decrypt_User();
        if (user === null) {
            navigate('/')
            return;
        }
        setUserLogin(user)
    }

    useEffect(() => {
        OnInitPage()
    }, []);


    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
         setDataFacturas([]);
         setFileName('');
         setNumberRows(0);
         setNumberColumn(0);
        switch (event.target.value) {
            case 'pv':
                setTypeUploadLabel("PROVEEDORES")
                break;
            case 'pc':
                setTypeUploadLabel("PRODUCTOS COSTOS")
                break;
        }
        setValue(event.target.value);
    };

    const UploadExcel = () => {
        if (value.trim() === "") {
            return toast.warn("SELECCIONE UN TIPO DE EXCEL A SUBIR", { position: toast.POSITION.TOP_CENTER })
        }
        const functionThatReturnPromise = async () => {
            try {
                if (value === 'pv') {
                    await UPLOAD_DATA_MODEL_PROVEEDOR(DataFacturas);
                }
                if (value === 'pc') {
                    await UPLOAD_DATA_PRODUCT_COST(DataFacturas);
                }
            } catch (error) {
                throw error;
            }
        };
        manejoMensajes(functionThatReturnPromise, "SE INSERTO CORRECTAMENTE LA LISTA DE PROVEEDORES ....")
    }

    return (
        <>

            <ToastContainer />
            <NavbarMasterMoto titulo="PROCESO DE BODEGAS DE CONSIGNACIONES" />
            <br />
            <Paper elevation={3}
                style={{
                    marginRight: 20,
                    marginBottom: 20,
                    marginLeft: 20,
                    paddingTop: 20,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingBottom: 20
                }}>

                <Stack direction="column" justifyContent="space-around" alignItems='center'>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">OPCIONES: </FormLabel>
                        <RadioGroup
                            aria-label="position"
                            name="position"
                            value={value}
                            onChange={handleChange}
                            row
                        >
                            <FormControlLabel
                                value="pv"
                                control={<Radio />}
                                label={`SUBIR EXCEL PROVEEDORES`}
                                
                            />
                            <FormControlLabel
                                value="pc"
                                control={<Radio />}
                                label={`SUBIR EXCEL PRODUCTO COSTOS`}
                            />
                        </RadioGroup>
                    </FormControl>
                </Stack>
            </Paper>
            <Paper elevation={3}
                style={{
                    marginRight: 20,
                    marginLeft: 20,
                    paddingTop: 20,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingBottom: 20
                }}>
                <Grid container>
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {DataFacturas.length === 0 ? (<div className="excel-uploader-container">
                                <h1 style={{ fontWeight: 'bold' }}>SUBIR EXCEL DE {typeUploadLabel}</h1>
                                <Dropzone onDrop={handleFileUpload} accept=".xlsx">
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps()} className="dropzone" accept=".xlsx">
                                            <input {...getInputProps()} />
                                            <p>Arrastra y suelta un archivo Excel aquí, o haz clic para seleccionar un archivo</p>
                                        </div>
                                    )}
                                </Dropzone>
                            </div>) : (
                                <img src={excel_image}
                                    width={200}
                                    height={200}
                                    alt='logo de la empresa master moto'></img>)}
                            <div style={{ marginLeft: '19px', marginTop: '20px' }}>
                                <p><strong>NOMBRE ARCHIVO: </strong> {fileName}</p>
                                <p><strong>CANTIDAD FILAS: </strong> {numberRows} </p>
                                <p><strong>CANTIDAD COLUMNAS: </strong> {numberColumn}</p>
                                {DataFacturas.length > 0 && (
                                    <div className="excel-data-container">
                                        {/* <TextField id="filled-basic"
                                        label="Nombre lista de Precio"
                                        variant="filled"
                                        value={nameListPrice}
                                        onChange={(e) => setNameListPrice(e.target.value)}
                                        sx={{ width: '100%', marginBottom: '2px' }}
                                    /> */}
                                        <Button variant="contained" onClick={UploadExcel} fullWidth>SUBIR LISTA DE PROVEEDORES</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}

export default UploadExcelProvedor_BC