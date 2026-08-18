import { Typography } from "@mui/material"
import { TomaFisicaInventario } from "../models/TomaFisicaInventarioModel"
import UploadExcelDinamico from "@/components/UploadExcelDinamico"
import UploadExcel from "@/componentesCommons/UploadExcel"
import { InventarioCrearOpenBravoOutDto } from "../models/InventarioCrearOpenBravoOutDto"
import { grabarNuevoInventarioServicioWeb } from "../services/TomaFisicaInventarioService"
import { useLoading } from "@/componentesCommons/LoadingContext"
import { showAlert } from "@/utils/modalAlerts"

interface TomaFisicaInventarioProps {
  inventario?: TomaFisicaInventario
}

const SubirInventarioModal = ({ inventario }: TomaFisicaInventarioProps) => {
  const { startLoading, stopLoading } = useLoading();
  const subirExcelInventario = async (items: any[]) => {
    try {
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
      await grabarNuevoInventarioServicioWeb(data);
      showAlert({
        title: "Correcto",
        message: "El inventario se subio correctamente",
        type: "success"
      })
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      {inventario?.estatus === "F" && <Typography>LA TOMA FISICA ESTA INACTIVADA</Typography>}
      <Typography>{inventario?.nombre ?? "SIN NOMBRE"}</Typography>
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

    </>
  )
}

export default SubirInventarioModal