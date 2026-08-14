import BasePage from '@/componentesCommons/BasePage'
import { configureMicrofrontendAuth } from '@/CustomElements/auth/configureMicrofrontendAuth'

const ComprobantesPagosIndex = () => {
  return (
    <>
        <mf-subir-comprobantes ref={configureMicrofrontendAuth}
      style={{
        display: 'block',
        width: '100%',
        minHeight: '100%',
      }}/>
    </>
  )
}

export default ComprobantesPagosIndex