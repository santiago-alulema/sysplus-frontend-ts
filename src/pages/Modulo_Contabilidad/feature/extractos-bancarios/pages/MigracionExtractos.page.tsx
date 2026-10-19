import { configureMicrofrontendAuth } from "@/CustomElements/auth/configureMicrofrontendAuth"

const MigracionExtractosPage = () => {
  return (
    <>
        <mf-migracion-extractos-bancarios ref={configureMicrofrontendAuth}
                                      style={{
                                        display: 'block',
                                        width: '100%',
                                        minHeight: '100%',
                                      }}/>
    </>
  )
}

export default MigracionExtractosPage