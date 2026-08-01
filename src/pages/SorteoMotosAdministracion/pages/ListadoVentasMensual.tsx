import CustomDataGridTs from "@/componentesCommons/CustomDataGridTs"
import { ConfigSorteoTikTok } from "../configs/ConfigSorteoTikTok"
import { useEffect, useState } from "react"
import { sorteoDtoIn } from "../models/sorteoDtoIn"
import { descargarCsvSorteoFactrura, listarFacturasSorteo } from "../services/ServicioWebSorteo"
import { useLoading } from "@/componentesCommons/LoadingContext"
import { Button, Grid } from "@mui/material"

const ListadoVentasMensual = () => {
    const [listaSorteo, setListaSorteo] = useState<sorteoDtoIn[]>([])
    const { startLoading, stopLoading } = useLoading()

    const obtenerDatosSorteo = async () => {
        startLoading()
        const respuesta = await listarFacturasSorteo();
        setListaSorteo(respuesta);
        stopLoading();
    }

    const descargarCsv = async () => {
        startLoading()
        await descargarCsvSorteoFactrura();
        stopLoading();
    }

    useEffect(() => {
        obtenerDatosSorteo();
    }, [])


    return (
        <>
            <Grid container spacing={2} >
                <Grid item lg={12} mb={2} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <Button onClick={descargarCsv}>Descargar CSV</Button>
                </Grid>
                <Grid item lg={12}>
                    <CustomDataGridTs
                        gridId="listadoSorteo"
                        rows={listaSorteo}
                        columns={ConfigSorteoTikTok()}
                        searchLabel={'buscar'}

                    />
                </Grid>
            </Grid>
        </>
    )
}

export default ListadoVentasMensual