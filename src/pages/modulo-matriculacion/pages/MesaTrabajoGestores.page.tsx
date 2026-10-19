import { configureMicrofrontendAuth } from '@/CustomElements/auth/configureMicrofrontendAuth'
import React from 'react'

const MesaTrabajoGestoresPage = () => {
  return (
    <>
        <mf-mesa-gestores ref={configureMicrofrontendAuth}
                              style={{
                                display: 'block',
                                width: '100%',
                                minHeight: '100%',
                              }} />
    </>
  )
}

export default MesaTrabajoGestoresPage