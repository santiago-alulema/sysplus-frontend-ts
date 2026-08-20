import { useEffect, useState } from 'react';

import {
    Autocomplete,
    CircularProgress,
    TextField
} from '@mui/material';

import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';

import type { OpcionInventario } from '../models/AgenciaAuditoria';
import { obtenerTomasFisicas } from '../services/agencia-auditoria.service';

interface Props {
    empresaId: string;
    value: string;
    onChange: (tomaFisicaId: string) => void;
}

const TomaFisicaAutocompleteComponent = ({
    empresaId,
    value,
    onChange
}: Props) => {

    const [tomasFisicas, setTomasFisicas] = useState<OpcionInventario[]>([]);

    const [cargando, setCargando] = useState(false);

    useEffect(() => {

        setTomasFisicas([]);

        if (!empresaId)
            return;

        const cargarTomas = async () => {

            setCargando(true);

            try {
                const response = await obtenerTomasFisicas(empresaId);

                setTomasFisicas(response);
            }
            finally {
                setCargando(false);
            }
        };

        cargarTomas();

    }, [empresaId]);

    return (
        <Autocomplete
            fullWidth
            options={tomasFisicas}
            disabled={!empresaId || cargando}
            getOptionLabel={x => x.nombre}
            isOptionEqualToValue={(option, value) =>
                option.id === value.id
            }
            value={
                tomasFisicas.find(x => x.id === value) ?? null
            }
            onChange={(_, toma) =>
                onChange(toma?.id ?? '')
            }
            renderInput={params => (
                <TextField
                    {...params}
                    label="Toma física"
                    size="small"
                    InputProps={{
                        ...params.InputProps,

                        startAdornment: (
                            <>
                                <InventoryOutlinedIcon
                                    sx={{
                                        mr: 1,
                                        color: 'text.secondary'
                                    }}
                                />

                                {params.InputProps.startAdornment}
                            </>
                        ),

                        endAdornment: (
                            <>
                                {cargando && (
                                    <CircularProgress size={18} />
                                )}

                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                />
            )}
        />
    );
};

export default TomaFisicaAutocompleteComponent;