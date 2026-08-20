import { useEffect, useState } from 'react';

import {
    Autocomplete,
    TextField
} from '@mui/material';

import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';

import type { OpcionInventario } from '../models/AgenciaAuditoria';
import { obtenerEmpresas } from '../services/agencia-auditoria.service';

interface Props {
    value: string;
    onChange: (empresaId: string) => void;
}

const EmpresaAutocompleteComponent = ({
    value,
    onChange
}: Props) => {

    const [empresas, setEmpresas] = useState<OpcionInventario[]>([]);

    useEffect(() => {
        obtenerEmpresas().then(setEmpresas);
    }, []);

    return (
        <Autocomplete
            fullWidth
            options={empresas}
            getOptionLabel={x => x.nombre}
            isOptionEqualToValue={(option, value) =>
                option.id === value.id
            }
            value={
                empresas.find(x => x.id === value) ?? null
            }
            onChange={(_, empresa) =>
                onChange(empresa?.id ?? '')
            }
            renderInput={params => (
                <TextField
                    {...params}
                    label="Empresa"
                    size="small"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <BusinessOutlinedIcon
                                    sx={{
                                        mr: 1,
                                        color: 'text.secondary'
                                    }}
                                />

                                {params.InputProps.startAdornment}
                            </>
                        )
                    }}
                />
            )}
        />
    );
};

export default EmpresaAutocompleteComponent;