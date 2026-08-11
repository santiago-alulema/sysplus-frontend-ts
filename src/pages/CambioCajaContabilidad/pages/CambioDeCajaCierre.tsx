import CustomDataGridTs from '@/componentesCommons/DataGridCommon/CustomDataGridTs';
import { ConfiguracionColumnasCierreCajas } from "../configs/ConfiguracionColumnasCierreCajas"
import { useEffect, useState } from "react"
import { Divider } from "@mui/material"
import { CierreCajaInDto } from "../models/CierreCajaInDto"
import {  catualizarFechaCierreCaja, listarCajasOpenServiceWeb } from "../services/ServicioWebCambioFechaCaja"
import { Get_Organizations } from "@/services/Service_Api_Agencia"
import CustomAutocompleteTs from "@/componentesCommons/CustomAutocompleteTs"
import { IActionConfig } from "@/componentesCommons/IActionConfig"
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import CambiarFechaComponent from "../components/CambiarFechaComponent";
import CustomModalTs from "@/componentesCommons/DataGridCommon/CustomModalTs";
import { showAlert, showAlertConfirm } from "@/utils/modalAlerts";
import { useLoading } from "@/componentesCommons/LoadingContext";
const CambioDeCajaCierre = () => {
    const [open, setOpen] = useState<boolean>(false)
    const {startLoading, stopLoading} = useLoading();
    const [cajasCerrar, setCajasCerrar] = useState<CierreCajaInDto[]>([])
    const [agencias, setAgencias] = useState<any[]>([])
    const [agencia, setAgencia] = useState<any>(null)



    const listarCajas = async (agencia: any) =>{
        startLoading();
        const respuesta = await listarCajasOpenServiceWeb(agencia.ad_org_id);
        setCajasCerrar(respuesta);
        stopLoading();
    }

    const listarAgencias = async () =>{
        startLoading();
        const response = await Get_Organizations();
        setAgencias(response);
        stopLoading();
    }

    useEffect(() => {
      listarAgencias();
    }, [])
    
    const grabarCambioFecha = async (fecha: string) => {
       try {
         if(!fecha){
            const configAlert = {
                                title: "Error",
                                message: "La fecha no puede ser vacia",
                                type: 'error',
                                callBackFunction: false,
                            };
            showAlert(configAlert);
        }

        const configAlert = {
                                title: "Advertencia",
                                message: "Esta seguro que desea cambiar la fecha ?",
                                type: 'warning',
                                callBackFunction: false,
                            };
        const respuesta = await showAlertConfirm(configAlert);
        if(respuesta){
            startLoading();
            await catualizarFechaCierreCaja(agencia.id,fecha)
                const configAlert = {
                                title: "Correcto",
                                message: "Se actualizo correctamente",
                                type: 'sucess',
                                callBackFunction: true,
                                onCloseFunction:listarCajas(agencia.id)
                            };
                showAlert(configAlert);
                listarCajas(agencia.id)
        }
       } finally{
        stopLoading();
       }
    };

    const clickCajas = (item:any) =>{
        setAgencia(item);
        setOpen(true)
    }
    const actionsConfig: IActionConfig[] = [
    {
        tooltip: "Liquidar",
        onClick: clickCajas,
        icon: <ChangeCircleIcon />,
        hidden: false,
        sizeIcon: 'large',
        label: 'Liquidar',
        typeInput: 'icon',
        inputSize: '15'
    },
    ];
    return (
        <>
            <div style={{marginBottom: 12}}>
                <CustomAutocompleteTs options={agencias}
                labelFullField="Agencias"
                label="Seleccionar agencia"
                handleChange={(e, value:any) =>listarCajas(value)}/>
            </div>
            <Divider />
            <div style={{marginTop: 12}}>
                <CustomDataGridTs
                columns={ConfiguracionColumnasCierreCajas()}
                rows={cajasCerrar}
                gridId="CambiosCajas"
                searchLabel='Buscar'
                actions={actionsConfig}
            />
            </div>

            <CustomModalTs open={open} 
                            handleClose={() => setOpen(false)} >
                <CambiarFechaComponent handlerSave={grabarCambioFecha} />
            </CustomModalTs>
        </>
    )
}

export default CambioDeCajaCierre