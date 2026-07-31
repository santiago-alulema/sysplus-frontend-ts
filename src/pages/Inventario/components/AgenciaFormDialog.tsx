import {
    useEffect,
    useState
} from 'react';

import type {
    FormEvent
} from 'react';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField
} from '@mui/material';


import type {
    Agencia,
    AgenciaFormData,
    EmpresaOption
} from '../models/agencia.model';
import CustomAutocompleteTs from '@/componentesCommons/CustomAutocompleteTs';

interface AgenciaFormDialogProps {
    open: boolean;
    agencia: Agencia | null;
    empresas: EmpresaOption[];
    guardando: boolean;
    onClose: () => void;
    onGuardar: (data: AgenciaFormData) => Promise<void>;
}

const FORMULARIO_INICIAL: AgenciaFormData = {
    nombre: '',
    descripcion: '',
    empresaId: ''
};

const AgenciaFormDialog = ({
    open,
    agencia,
    empresas,
    guardando,
    onClose,
    onGuardar
}: AgenciaFormDialogProps) => {
    const [formulario, setFormulario] =
        useState<AgenciaFormData>(FORMULARIO_INICIAL);

    const [mostrarErrores, setMostrarErrores] =
        useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setFormulario({
            nombre: agencia?.nombre ?? '',
            descripcion: agencia?.descripcion ?? '',
            empresaId: agencia?.empresaId ?? ''
        });

        setMostrarErrores(false);
    }, [open, agencia]);

    const empresaSeleccionada =
        empresas.find(
            empresa => empresa.id === formulario.empresaId
        ) ?? null;

    const nombreInvalido =
        mostrarErrores && !formulario.nombre.trim();

    const empresaInvalida =
        mostrarErrores && !formulario.empresaId;

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();

        setMostrarErrores(true);

        if (
            !formulario.nombre.trim() ||
            !formulario.empresaId
        ) {
            return;
        }

        await onGuardar({
            nombre: formulario.nombre.trim(),
            descripcion: formulario.descripcion.trim(),
            empresaId: formulario.empresaId
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                <DialogTitle>
                    {agencia ? 'Editar agencia' : 'Nueva agencia'}
                </DialogTitle>

                <DialogContent dividers>
                    <Stack spacing={2}>
                        <TextField
                            label="Nombre"
                            value={formulario.nombre}
                            onChange={event =>
                                setFormulario(current => ({
                                    ...current,
                                    nombre: event.target.value
                                }))
                            }
                            error={nombreInvalido}
                            helperText={
                                nombreInvalido
                                    ? 'El nombre es obligatorio.'
                                    : ''
                            }
                            size="small"
                            fullWidth
                            autoFocus
                        />

                        <TextField
                            label="Descripción"
                            value={formulario.descripcion}
                            onChange={event =>
                                setFormulario(current => ({
                                    ...current,
                                    descripcion: event.target.value
                                }))
                            }
                            size="small"
                            fullWidth
                            multiline
                            minRows={2}
                            maxRows={4}
                        />

                        <CustomAutocompleteTs
                            label="Empresa"
                            labelFullField="Empresa"
                            options={empresas}
                            defaultValue={empresaSeleccionada}
                            optionValue="id"
                            optionLabel="nombre"
                            requiredField
                            errorField={empresaInvalida}
                            message="La empresa es obligatoria."
                            handleChange={(_, value) =>
                                setFormulario(current => ({
                                    ...current,
                                    empresaId: value?.id
                                        ? String(value.id)
                                        : ''
                                }))
                            }
                        />
                    </Stack>
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

export default AgenciaFormDialog;