import { configureMicrofrontendAuth } from "@/CustomElements/auth/configureMicrofrontendAuth"

const ControlPagosPlaca = () => {
  return (
    <>
        <mf-subir-pagos-placa ref={configureMicrofrontendAuth}
              style={{
                display: 'block',
                width: '100%',
                minHeight: '100%',
              }}
        />
    </>
  )
}

export default ControlPagosPlaca