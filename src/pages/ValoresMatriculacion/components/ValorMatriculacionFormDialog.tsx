import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField
} from '@mui/material';

import CustomAutocompleteTs from '@/componentesCommons/CustomAutocompleteTs';

import type {
    AgenciaMatriculacionOption,
    ValorMatriculacion,
    ValorMatriculacionFormData
} from '../models/valorMatriculacion.model';

interface Props {
    open: boolean;
    valor: ValorMatriculacion | null;
    agencias: AgenciaMatriculacionOption[];
    guardando: boolean;
    onClose: () => void;
    onGuardar: (data: ValorMatriculacionFormData) => Promise<void>;
}

const FORMULARIO_INICIAL: ValorMatriculacionFormData = {
    agenciaId: '',
    ciudad: '',
    totalMatriculacion: null,
    gestor: '',
    cedulaIdentidad: '',
    pagosExtraordinarios: null,
    agenciaDestinoId: '',
    username: ''
};

const ValorMatriculacionFormDialog = ({
    open,
    valor,
    agencias,
    guardando,
    onClose,
    onGuardar
}: Props) => {
    const [formulario, setFormulario] =
        useState<ValorMatriculacionFormData>(FORMULARIO_INICIAL);

    const [mostrarErrores, setMostrarErrores] = useState(false);

    useEffect(() => {
        if (!open)
            return;

        setFormulario({
            agenciaId: valor?.agenciaId ?? '',
            ciudad: valor?.ciudad ?? '',
            totalMatriculacion: valor?.totalMatriculacion ?? null,
            gestor: valor?.gestor ?? '',
            cedulaIdentidad: valor?.cedulaIdentidad ?? '',
            pagosExtraordinarios: valor?.pagosExtraordinarios ?? null,
            agenciaDestinoId: valor?.agenciaDestinoId ?? '',
            username: valor?.username ?? ''
        });

        setMostrarErrores(false);
    }, [open, valor]);

    const agenciaSeleccionada =
        agencias.find(x => x.id === formulario.agenciaId) ?? null;

    const agenciaDestinoSeleccionada =
        agencias.find(x => x.id === formulario.agenciaDestinoId) ?? null;

    const handleNumero = (
        campo: 'totalMatriculacion' | 'pagosExtraordinarios',
        valorCampo: string
    ) => {
        setFormulario(actual => ({
            ...actual,
            [campo]: valorCampo === '' ? null : Number(valorCampo)
        }));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setMostrarErrores(true);

        if (
            !formulario.username.trim() ||
            !formulario.agenciaId ||
            !formulario.agenciaDestinoId
        ) {
            return;
        }

        await onGuardar({
            ...formulario,
            username: formulario.username.trim(),
            gestor: formulario.gestor.trim(),
            cedulaIdentidad: formulario.cedulaIdentidad.trim(),
            ciudad: formulario.ciudad.trim()
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle>
                    {valor
                        ? 'Editar valor de matriculación'
                        : 'Nuevo valor de matriculación'}
                </DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Usuario"
                                value={formulario.username}
                                onChange={event =>
                                    setFormulario(actual => ({
                                        ...actual,
                                        username: event.target.value
                                    }))
                                }
                                error={
                                    mostrarErrores &&
                                    !formulario.username.trim()
                                }
                                helperText={
                                    mostrarErrores &&
                                    !formulario.username.trim()
                                        ? 'El usuario es obligatorio.'
                                        : ''
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Gestor"
                                value={formulario.gestor}
                                onChange={event =>
                                    setFormulario(actual => ({
                                        ...actual,
                                        gestor: event.target.value
                                    }))
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Cédula"
                                value={formulario.cedulaIdentidad}
                                onChange={event =>
                                    setFormulario(actual => ({
                                        ...actual,
                                        cedulaIdentidad: event.target.value
                                    }))
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Ciudad"
                                value={formulario.ciudad}
                                onChange={event =>
                                    setFormulario(actual => ({
                                        ...actual,
                                        ciudad: event.target.value
                                    }))
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <CustomAutocompleteTs
                                label="Agencia"
                                labelFullField="Agencia"
                                options={agencias}
                                defaultValue={agenciaSeleccionada}
                                optionValue="id"
                                optionLabel="nombre"
                                requiredField
                                errorField={
                                    mostrarErrores &&
                                    !formulario.agenciaId
                                }
                                message="La agencia es obligatoria."
                                handleChange={(_, value) =>
                                    setFormulario(actual => ({
                                        ...actual,
                                        agenciaId: value?.id
                                            ? String(value.id)
                                            : ''
                                    }))
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <CustomAutocompleteTs
                                label="Agencia destino"
                                labelFullField="Agencia destino"
                                options={agencias}
                                defaultValue={agenciaDestinoSeleccionada}
                                optionValue="id"
                                optionLabel="nombre"
                                requiredField
                                errorField={
                                    mostrarErrores &&
                                    !formulario.agenciaDestinoId
                                }
                                message="La agencia destino es obligatoria."
                                handleChange={(_, value) =>
                                    setFormulario(actual => ({
                                        ...actual,
                                        agenciaDestinoId: value?.id
                                            ? String(value.id)
                                            : ''
                                    }))
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Total matriculación"
                                type="number"
                                value={formulario.totalMatriculacion ?? ''}
                                onChange={event =>
                                    handleNumero(
                                        'totalMatriculacion',
                                        event.target.value
                                    )
                                }
                                inputProps={{
                                    min: 0,
                                    step: '0.01'
                                }}
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Pagos extraordinarios"
                                type="number"
                                value={formulario.pagosExtraordinarios ?? ''}
                                onChange={event =>
                                    handleNumero(
                                        'pagosExtraordinarios',
                                        event.target.value
                                    )
                                }
                                inputProps={{
                                    min: 0,
                                    step: '0.01'
                                }}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={onClose}
                        disabled={guardando}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={guardando}
                    >
                        {guardando ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ValorMatriculacionFormDialog;
