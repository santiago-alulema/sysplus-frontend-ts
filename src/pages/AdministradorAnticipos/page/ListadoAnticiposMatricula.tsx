import CustomDataGridTs from "@/componentesCommons/CustomDataGridTs"
import { AnticiposConfiguracionColumnas } from "../configurations/AnticiposConfiguracionColumnas"
import React, { useEffect, useState } from "react"
import { anticipoPorLiquidarServiceWeb } from "../services/ServicioWebAnticipoAdministracion"
import { AnticiposPorLiquidarInDto } from "../models/AnticiposPorLiquidarInDto"
import FiberNewIcon from '@mui/icons-material/FiberNew';
import { IActionConfig } from "@/componentesCommons/IActionConfig"
import LiquidacionNuevaPantalla from "./LiquidacionNuevaPantalla"
import CustomModalTs from "@/componentesCommons/CustomModalTs"
import { useLoading } from "@/componentesCommons/LoadingContext"
import { Decrypt_User } from "@/services/Storage_Service"

const ListadoAnticiposMatricula = () => {
  const [anticipos, setAnticipos] = useState<AnticiposPorLiquidarInDto[]>([]);
  const [numeroFactura, setNumeroFactura] = useState<string | null>(null);
  const [abrirModal, setAbrirModal] = useState<boolean>(false);
  const { startLoading, stopLoading } = useLoading();

  const usuariosAdministracion = ["AMANDAGALARZA", "JOSUEORDONEZ", "KARENSINCHI"]

  const cargarAnticipo = async () => {
    try {
      startLoading();
      const user = Decrypt_User();

      const repuesta = await anticipoPorLiquidarServiceWeb(usuariosAdministracion.includes(user.User) ? "001-002-ADMINISTRACION" : user?.OrganizationName, user?.User ?? "");
      setAnticipos(repuesta)
    } finally {
      stopLoading();
    }
  }
  useEffect(() => {
    cargarAnticipo();
  }, [])

  useEffect(() => {
    cargarAnticipo();
  }, [abrirModal])

  const abrirAnticipoParaLiquidar = (item: AnticiposPorLiquidarInDto) => {
    setNumeroFactura(item.factura);
    setAbrirModal(true)
  }

  const actionsConfig: IActionConfig[] = [
    {
      tooltip: "Liquidar",
      onClick: abrirAnticipoParaLiquidar,
      icon: <FiberNewIcon />,
      hidden: false,
      sizeIcon: 'small',
      label: 'Liquidar',
      typeInput: 'button',
      inputSize: 'clamp(20px, 0.264rem + 1.229vw, 1.75rem)'
    },
  ];

  return (
    <>
      <CustomDataGridTs
        gridId="gridAnticipos"
        rows={anticipos}
        actions={actionsConfig}
        searchLabel={"Buscar"}
        getRowId={((row: AnticiposPorLiquidarInDto) => `${row.codigoanticipo}-${row.ramv}`)}
        columns={AnticiposConfiguracionColumnas()}
      />
      <CustomModalTs open={abrirModal}
        handleClose={() => setAbrirModal(prev => !prev)}
        width="80%" height="100%">
        <LiquidacionNuevaPantalla numeroDocumento={numeroFactura ?? ""} />
      </CustomModalTs>
    </>
  )
}

export default ListadoAnticiposMatricula