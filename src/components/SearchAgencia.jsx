

import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { Get_Organizations } from '../services/Service_Api_Agencia';

const SearchAgencia = ({ setCodAgencia, title = "AGENCIA" }) => {
  const [organizations, setOrganizations] = useState([]);
  const get_Organitations = async () => {
    const response = await Get_Organizations();
    setOrganizations([{ ad_org_id: "", name: "--SELECCIONAR AGENCIA--" },
    { ad_org_id: "5E9EFB596D774A9DA6D2AE2432558A5A", name: "B81-BODEGA-MAPASINGUE" },
    ...response]);
  };

  const handleSelect = (event, newValue) => {
    event.preventDefault()
    setCodAgencia(newValue ? newValue.value : null);
  };
  useEffect(() => {
    get_Organitations();
  }, []);
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Autocomplete
      sx={{
        "& .MuiAutocomplete-inputRoot": {
            height: "36px !important",
            minHeight: "45px !important",
            padding: "0 8px !important",
        },
        "& .MuiAutocomplete-input": {
            padding: "0 4px !important",
            fontSize: "13px",
        },
        "& .MuiInputLabel-root": {
            fontSize: "12px",
            top: "7px",
        },
        "& .MuiInputLabel-shrink": {
            top: 0,
        },
    }}
      size="small"
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={organizations.map((org) => ({
          value: org.ad_org_id,
          label: org.name,
        }))}
        isOptionEqualToValue={(option, value) => option.value === value}
        onChange={handleSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            label={title}
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
    </Stack>
  );
}
export default SearchAgencia
