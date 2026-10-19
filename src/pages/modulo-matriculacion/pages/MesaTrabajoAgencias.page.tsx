import { configureMicrofrontendAuth } from "@/CustomElements/auth/configureMicrofrontendAuth"


const MesaTrabajoAgenciasPage = () => {
  return (
    <>
        <mf-entrega-motocicleta ref={configureMicrofrontendAuth}
                              style={{
                                display: 'block',
                                width: '100%',
                                minHeight: '100%',
                              }}/>
    </>
  )
}

export default MesaTrabajoAgenciasPage