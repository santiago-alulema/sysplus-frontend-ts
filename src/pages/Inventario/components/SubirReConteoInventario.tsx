import { useLoading } from "@/componentesCommons/LoadingContext";
import { TomaFisicaInventario } from "../models/TomaFisicaInventarioModel";
import { InventarioCrearOpenBravoOutDto } from "../models/InventarioCrearOpenBravoOutDto";
import { grabarNuevoInventarioServicioWeb, grabarReconteoOpenBravoServicioWeb } from "../services/TomaFisicaInventarioService";
import { Card, CardContent, CardHeader, Stack, Typography } from "@mui/material";
import UploadExcel from "@/componentesCommons/UploadExcel";
import CustomDatePicker from "@/componentesCommons/CustomDatePicker";
import { Dispatch, SetStateAction, useState } from "react";
import dayjs from "dayjs";
import { showAlert } from "@/utils/modalAlerts";
import { ReconteoInventarioOutDto } from "../models/ReconteoInventarioOutDto";

interface TomaFisicaInventarioProps {
    inventario?: TomaFisicaInventario,
    cerrarModal: Dispatch<SetStateAction<boolean>>;
}

const SubirReConteoInventario = ({ inventario, cerrarModal }: TomaFisicaInventarioProps) => {
    const diaActual = dayjs()
    const [fechaInicio, setFechaInicio] = useState<string>(diaActual.format("YYYY-MM-DD"));
    const [fechaFin, setFechaFin] = useState<string>(diaActual.add(5, 'day').format("YYYY-MM-DD"));

    const { startLoading, stopLoading } = useLoading();
    const subirExcelInventario = async (items: any[]) => {
        console.log("first")
        try {
            if (dayjs(fechaInicio).isAfter(dayjs(fechaFin)) ){
                showAlert({
                    title: "Error",
                    type: "error",
                    message: "La fecha fin no puede ser mayor a la de fin"
                })
            }

            startLoading();
            const data: InventarioCrearOpenBravoOutDto[] = items.map((item) => ({
                categoria: item["categoria"],
                codigo: item["codigo"],
                nombre: item["nombre"],
                atributo1: item["atributo1"],
                atributo2: item["atributo2"],
                atributo3: item["atributo3"],
                atributo4: item["atributo4"],
                atributo5: item["atributo5"],
                tercero: item["tercero"],
                factura: item["factura"],
                cantidad: item["cantidad"],
                unidad: item["unidad"],
                fechaPedido: item["fecha pedido"],
                costo: item["costo"],
                costoModificado: item["costo modificado"],
                codigoOem: item["codigo oem"],
                almacen: item["almacen"],
                ubicacion: item["ubicacion"],
                usuario: item["usuario"],
                status: "true",
                rac: item["rac"],
                columna: item["columna"],
                idTomaFisicaInventario: inventario?.id,
                nivel: item["nivel"],
                posicion: item["posicion"],
                empresaId: inventario?.empresaId,
            }));
            const enviarReconteo: ReconteoInventarioOutDto ={
                inventarioId: inventario?.id ?? "SID",
                fechaFin: fechaFin,
                fechaInicio: fechaInicio,
                inventarioOpen: data,
            }
            await grabarReconteoOpenBravoServicioWeb(enviarReconteo);
               showAlert({
                    title: "Correcto",
                    type: "success",
                    message: "Re-Conteo fue subido exitosamente"
                })

                cerrarModal(false);
        } finally {
            stopLoading();
        }
    };
    return (
        <>
            <Typography fontSize={25} textAlign='center'>SUBIR RECONTEO
                <Typography fontWeight={800} fontSize={20} >INVENTARIO: {inventario?.nombre.toLocaleUpperCase() ?? "SIN NOMBRE"}</Typography>
            </Typography>
            <Card>
                
                <CardContent>
                    <Stack spacing={2} direction='row' justifyContent='space-around' mb={2}>
                        <CustomDatePicker  key="1" defaultValue={fechaInicio} onChangeValue={(value) => setFechaInicio(value ?? '')} label="Fecha Inicio"/>
                        <CustomDatePicker key="2" defaultValue={fechaFin} onChangeValue={(value) => setFechaFin(value ?? '')} label="Fecha Fin"/>
                    </Stack>
                    <UploadExcel
                        requiredColumns={{
                            categoria: "string",
                            codigo: "string",
                            nombre: "string",
                            atributo1: "string",
                            atributo2: "string",
                            atributo3: "string",
                            atributo4: "string",
                            atributo5: "string",
                            tercero: "string",
                            factura: "string",
                            cantidad: "number",
                            unidad: "string",
                            "fecha pedido": "date",
                            costo: "number",
                            "costo modificado": "number",
                            "codigo oem": "string",
                            almacen: "string",
                            ubicacion: "string",
                            usuario: "string",
                            fechaauditoria: "date",
                            status: "string",
                            rac: "string",
                            columna: "string",
                            nivel: "string",
                            posicion: "string",
                        }}

                        onFileProcessed={subirExcelInventario}
                    />
                </CardContent>
            </Card>

        </>
    )
}

export default SubirReConteoInventario