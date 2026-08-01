import React, { useEffect } from 'react'
import { Paper } from '@mui/material';
import InformacionFactura from '@/components/LiquidacionMatricula/InformacionFactura';
import LiquidacionMatriculaComponente from '@/components/LiquidacionMatricula/LiquidacionMatriculaComponente';

const LiquidacionNuevaPantalla = (numeroDocumento) => {
  const [numeroIdentificacion, setNumeroIdentificacion] = React.useState("")
  const [numeroFacturaGrabar, setNumeroFacturaGrabar] = React.useState("")
  const [ramv, setramv] = React.useState("")
  const [keyComponent, setKeyComponent] = React.useState(1)

  useEffect(() => {
    if (numeroDocumento) {
      setNumeroFacturaGrabar(numeroDocumento.numeroDocumento)
    }
  }, [])

  return (
    <div key={keyComponent}>
      <br />
      <Paper elevation={3}
        style={{
          marginRight: 20,
          marginLeft: 20,
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20
        }}>
        <InformacionFactura setNumeroIdentificacion={setNumeroIdentificacion} numeroFacturaGrabar={numeroDocumento.numeroDocumento} setNumeroFacturaGrabar={setNumeroFacturaGrabar} setramv={setramv} />
        <br />
        {!!numeroIdentificacion ? (
          <LiquidacionMatriculaComponente numeroIdentificacion={numeroIdentificacion} numeroFacturaGrabar={numeroFacturaGrabar} ramv={ramv} setKeyComponent={setKeyComponent} />
        ) : ""}
      </Paper>
    </div>
  )
}

export default LiquidacionNuevaPantalla