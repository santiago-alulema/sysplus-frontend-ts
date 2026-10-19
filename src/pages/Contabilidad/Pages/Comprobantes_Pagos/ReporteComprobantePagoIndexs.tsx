import { configureMicrofrontendAuth } from '@/CustomElements/auth/configureMicrofrontendAuth'

const ReporteComprobantePagoIndexs = () => {
  return (
    <>
        <mf-reporte-comprobantes ref={configureMicrofrontendAuth}
      style={{
        display: 'block',
        width: '100%',
        minHeight: '100%',
      }}/>
    </>
  )
}

export default ReporteComprobantePagoIndexs

