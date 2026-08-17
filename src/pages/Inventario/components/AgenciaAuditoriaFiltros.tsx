import {
    Autocomplete,
    Paper,
    Stack,
    TextField
} from '@mui/material';

import type {
    OpcionInventario
} from '../models/AgenciaAuditoria';


interface Props {

    empresas: OpcionInventario[];

    tomasFisicas: OpcionInventario[];

    empresaId: string;

    tomaFisicaInventarioId: string;

    onEmpresaChange:
    (empresa: OpcionInventario | null) => void;

    onTomaFisicaChange:
    (toma: OpcionInventario | null) => void;
}


const AgenciaAuditoriaFiltros = ({
    empresas,
    tomasFisicas,
    empresaId,
    tomaFisicaInventarioId,
    onEmpresaChange,
    onTomaFisicaChange
}: Props) => {

    return (

        <Paper
            variant="outlined"
            sx={{
                p: 2,
                borderRadius: 2
            }}
        >

            <Stack
                direction={{
                    xs: 'column',
                    md: 'row'
                }}
                spacing={2}
            >

                <Autocomplete
                    fullWidth
                    options={empresas}
                    getOptionLabel={x => x.nombre}
                    isOptionEqualToValue={
                        (option, value) =>
                            option.id === value.id
                    }
                    value={
                        empresas.find(
                            x => x.id === empresaId
                        ) ?? null
                    }
                    onChange={(_, value) =>
                        onEmpresaChange(value)
                    }
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Empresa"
                            size="small"
                        />
                    )}
                />


                <Autocomplete
                    fullWidth
                    options={tomasFisicas}
                    disabled={!empresaId}
                    getOptionLabel={x => x.nombre}
                    isOptionEqualToValue={
                        (option, value) =>
                            option.id === value.id
                    }
                    value={
                        tomasFisicas.find(
                            x =>
                                x.id ===
                                tomaFisicaInventarioId
                        ) ?? null
                    }
                    onChange={(_, value) =>
                        onTomaFisicaChange(value)
                    }
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Toma física"
                            size="small"
                        />
                    )}
                />

            </Stack>

        </Paper>
    );
};

export default AgenciaAuditoriaFiltros;