import { configureMicrofrontendAuth } from "@/CustomElements/auth/configureMicrofrontendAuth"

const ReporteExtractoBancariosPage = () => {
  return (
    <>
    <mf-reporte-extract-banco ref={configureMicrofrontendAuth}
                                          style={{
                                            display: 'block',
                                            width: '100%',
                                            minHeight: '100%',
                                          }}/>
    </>
  )
}

export default ReporteExtractoBancariosPage