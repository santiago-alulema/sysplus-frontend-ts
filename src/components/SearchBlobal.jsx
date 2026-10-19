import { Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { manejoMensajes } from '../../src/helpers/ManejoExcepciones.js'
import { ToastContainer, toast } from 'react-toastify';
const SearchBlobal = ({ parameterSearch,
  setParameterSearch,
  functionExecute,
  title = "Buscar" }) => {

  const search = () => {
    manejoMensajes(functionExecute, "CARGANDO...")
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  }
  return (
    <>
      <ToastContainer />
      <Grid container>
        <Grid item xs={12} lg={10} sm={12} sx={12}>
          <TextField id="standard-basic"
            label={title}
            variant="outlined"
            sx={{
              height: '60px', // Altura del TextField completo
              '& .MuiInputBase-root': {
                height: '45px', // Altura del área de entrada
                fontSize: '14px', // Tamaño del texto dentro del input
              },
              '& .MuiInputLabel-root': {
                fontSize: '11px', // Tamaño del texto del label
              },
              '& .MuiInputLabel-shrink': {
                fontSize: '14px', // Tamaño del label cuando se mueve hacia arriba
              },
            }}
            fullWidth
            style={{ width: '100%' }}
            onChange={(e) => setParameterSearch(e.target.value)}
            value={parameterSearch}
            onKeyDown={handleKeyDown}
          />
        </Grid>
        <Grid item xs={12} lg={2} sm={12}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', padding: 2, marginLeft: 2 }} >
            <Button
              onClick={search}
              fullWidth
            >
              <Typography >
                {title}
              </Typography>
            </Button>
          </div>
        </Grid>
      </Grid>
      {/* </div> */}
    </>

  )
}

export default SearchBlobal