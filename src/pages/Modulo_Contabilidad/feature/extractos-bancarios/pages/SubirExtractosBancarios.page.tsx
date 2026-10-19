import { configureMicrofrontendAuth } from "@/CustomElements/auth/configureMicrofrontendAuth"

const SubirExtractosBancariosPage = () => {
  return (
    <>
        <mf-extracto-bancario-files ref={configureMicrofrontendAuth}
                                      style={{
                                        display: 'block',
                                        width: '100%',
                                        minHeight: '100%',
                                      }}/>
    </>
  )
}

export default SubirExtractosBancariosPage