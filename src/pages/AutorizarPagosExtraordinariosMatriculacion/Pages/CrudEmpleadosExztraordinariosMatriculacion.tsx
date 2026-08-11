import CustomAutocompleteTs from "@/componentesCommons/CustomAutocompleteTs"
import { Button, Grid } from "@mui/material"
import { eliminarUsuario, habilitarUsuario, ObtenerUsuariosHabilitadosMatriculacion, ObtenerUsuariosMatriculacion } from "../services/MatriculacionPagosExtraordinariosServiceWeb";
import { useEffect, useState } from "react";
import { UsuariosMatriculacion } from "../models/UsuariosMatriculacion";
import { useLoading } from "@/componentesCommons/LoadingContext";
import { ConfiguracionColumnaMatriculaPAgoExtraordinario } from "../configs/ConfiguracionColumnaMatriculaPAgoExtraordinario";
import { UsuariosHabilitadosInDto } from "../models/UsuariosHabilitadosInDto";
import { IActionConfig } from "@/componentesCommons/IActionConfig";
import DeleteIcon from '@mui/icons-material/Delete';
import CustomDataGridTs from "@/componentesCommons/DataGridCommon/CustomDataGridTs";

const CrudEmpleadosExtraordinariosMatriculacion = () => {
    const [gestores, setGestores] = useState<UsuariosMatriculacion[] | []>([]);
    const [idGestor, setIdGestor] = useState<string | null>("");
    const [usuarioHabilitados, setUsuariosHabilitados] = useState<UsuariosHabilitadosInDto[] | []>([]);
    const { startLoading, stopLoading } = useLoading();
    const [gridKey, setGridKey] = useState(0);
    const obtenerGestoresMatriculacion = async () => {
        try {
            startLoading();
            const response = await ObtenerUsuariosMatriculacion();
            setGestores(response);
        } finally {
            stopLoading();
        }
    }

    const habiliarAccesoSW = async () => {
        try {
            startLoading();
            await habilitarUsuario(idGestor ?? "")
            usuariosHabilitadosLista();
        } finally {
            stopLoading();
        }
    }


    const eliminarAcceso = async (item: UsuariosHabilitadosInDto) => {
        try {
            startLoading();
            await eliminarUsuario(item.id)
            usuariosHabilitadosLista();
            setGridKey(prev => prev + 1);
        } finally {
            stopLoading();
        }
    }

    const usuariosHabilitadosLista = async () => {
        try {
            startLoading();

            const respuesta = await ObtenerUsuariosHabilitadosMatriculacion();
            setUsuariosHabilitados(respuesta);
        } finally {
            stopLoading();
        }
    }

    useEffect(() => {
        obtenerGestoresMatriculacion();
        usuariosHabilitadosLista();
    }, [])


    const actionsConfig: IActionConfig[] = [
        {
            tooltip: "Liquidar",
            onClick: eliminarAcceso,
            icon: <DeleteIcon />,
            hidden: false,
            sizeIcon: 'small',
            typeInput: 'icon',
            inputSize: 'clamp(20px, 0.264rem + 1.229vw, 1.75rem)'
        },
    ];

    return (
        <Grid container spacing={3}>
            <Grid item lg={12} sm={12}>
                <CustomAutocompleteTs options={gestores}
                    label="Gestor"
                    handleChange={(e, value: UsuariosMatriculacion) => setIdGestor(value?.id ?? "")}
                    labelFullField="Seleccionar gestor" />
            </Grid>
            <Grid item lg={12} sm={12}>
                <Button fullWidth onClick={habiliarAccesoSW}>Habilitar edicion pagos extraordinarios</Button>
            </Grid>
            <Grid item lg={12} sm={12}>
                <CustomDataGridTs
                    key={gridKey}
                    getRowId={(row: UsuariosHabilitadosInDto) => `${row.cedulaidentidad}`}
                    gridId="EmpleadosExtraordinarioMatriculacion"
                    rows={usuarioHabilitados}
                    columns={ConfiguracionColumnaMatriculaPAgoExtraordinario()}
                    searchLabel={"Buscar"}
                    actions={actionsConfig}
                />
            </Grid>
        </Grid>
    )
}

export default CrudEmpleadosExtraordinariosMatriculacion