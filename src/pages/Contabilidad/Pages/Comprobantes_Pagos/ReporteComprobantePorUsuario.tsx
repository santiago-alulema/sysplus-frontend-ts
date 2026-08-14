import BasePage from '@/componentesCommons/BasePage'
import { configureMicrofrontendAuth } from '@/CustomElements/auth/configureMicrofrontendAuth'

const ReporteComprobantePorUsuario = () => {
  return (
    <>
        <mf-reporte-usuario-comprobante ref={configureMicrofrontendAuth}
      style={{
        display: 'block',
        width: '100%',
        minHeight: '100%',
      }}/>
    </>
  )
}


export default ReporteComprobantePorUsuario



