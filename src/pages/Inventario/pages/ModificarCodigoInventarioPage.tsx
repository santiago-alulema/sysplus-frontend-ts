import { useEffect, useState } from 'react';

import {
    Autocomplete,
    Paper,
    Stack,
    TextField
} from '@mui/material';

import BasePage from '@/componentesCommons/BasePage';

import ModificarCodigoInventario from '../components/ModificarCodigoInventario';
import TomaFisicaAutocompleteComponent from '../components/TomaFisicaAutocompleteComponent';

import type { OpcionInventario } from '../models/AgenciaAuditoria';
import { obtenerEmpresas } from '../services/agencia-auditoria.service';
import { useLoading } from '@/componentesCommons/LoadingContext';

const ModificarCodigoInventarioPage = () => {

    const [empresas, setEmpresas] = useState<OpcionInventario[]>([]);

    const [empresaId, setEmpresaId] = useState('');
    const [tomaFisicaId, setTomaFisicaId] = useState('');
    const {startLoading, stopLoading} = useLoading();
    useEffect(() => {
        const cargarEmpresas = async () => {
          try {
            startLoading();
            const response = await obtenerEmpresas();
            setEmpresas(response);
          } finally {
            stopLoading();
          }
        };
            cargarEmpresas();

    }, []);

    const cambiarEmpresa = (empresa: OpcionInventario | null) => {
        setEmpresaId(empresa?.id ?? '');

        // Limpiamos la toma física al cambiar empresa
        setTomaFisicaId('');
    };

    return (
        <BasePage title="Modificar código item inventario">

            <Stack spacing={2}>

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
                            isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                            }
                            value={
                                empresas.find(x => x.id === empresaId)
                                ?? null
                            }
                            onChange={(_, empresa) =>
                                cambiarEmpresa(empresa)
                            }
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label="Empresa"
                                    size="small"
                                />
                            )}
                        />

                        <TomaFisicaAutocompleteComponent
                            empresaId={empresaId}
                            value={tomaFisicaId}
                            onChange={setTomaFisicaId}
                        />

                    </Stack>

                </Paper>

                {tomaFisicaId && (
                    <ModificarCodigoInventario tomaFisicaId={tomaFisicaId}/>
                )}

            </Stack>

        </BasePage>
    );
};

export default ModificarCodigoInventarioPage;