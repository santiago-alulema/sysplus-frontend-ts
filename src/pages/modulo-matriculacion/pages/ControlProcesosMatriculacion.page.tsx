import { configureMicrofrontendAuth } from "@/CustomElements/auth/configureMicrofrontendAuth"

const ControlProcesosMatriculacionPage = () => {
  return (
    <>
        <mf-reporte-control-proceso ref={configureMicrofrontendAuth}
                      style={{
                        display: 'block',
                        width: '100%',
                        minHeight: '100%',
                      }}/>
    </>
  )
}

export default ControlProcesosMatriculacionPage