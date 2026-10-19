import { configureMicrofrontendAuth } from '@/CustomElements/auth/configureMicrofrontendAuth'
import React from 'react'

const ControlDepositoGestores = () => {
  return (
    <>
        <mf-valores-deposito-gestores ref={configureMicrofrontendAuth}
                      style={{
                        display: 'block',
                        width: '100%',
                        minHeight: '100%',
                      }} />
    </>
  )
}

export default ControlDepositoGestores