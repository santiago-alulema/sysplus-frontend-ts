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
    Grid,
    TextField
} from '@mui/material';
import { EmpleadoInventario, EmpleadoInventarioFormData, EmpresaInventarioOption } from '@/pages/Inventario/models/EmpleadoInventarioModel';
import CustomAutocompleteTs from '@/componentesCommons/CustomAutocompleteTs';


interface Props {
    open: boolean;
    empleado: EmpleadoInventario | null;
    empresas: EmpresaInventarioOption[];
    guardando: boolean;
    onClose: () => void;
    onGuardar: (
        data: EmpleadoInventarioFormData
    ) => Promise<void>;
}

const FORMULARIO_INICIAL: EmpleadoInventarioFormData = {
    identificacion: '',
    nombresApellido: '',
    telefono: '',
    idTipoEmpleado: '',
    nombreUsuario: '',
    empresaId: ''
};

const EmpleadoFormDialog = ({
    open,
    empleado,
    empresas,
    guardando,
    onClose,
    onGuardar
}: Props) => {
    const [formulario, setFormulario] =
        useState<EmpleadoInventarioFormData>(FORMULARIO_INICIAL);

    const [mostrarErrores, setMostrarErrores] =
        useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setFormulario({
            identificacion: empleado?.identificacion ?? '',
            nombresApellido: empleado?.nombresApellido ?? '',
            telefono: empleado?.telefono ?? '',
            idTipoEmpleado: empleado?.idTipoEmpleado ?? '',
            nombreUsuario: empleado?.nombreUsuario ?? '',
            empresaId: empleado?.empresaId ?? ''
        });

        setMostrarErrores(false);
    }, [open, empleado]);

    const empresaSeleccionada =
        empresas.find(
            empresa => empresa.id === formulario.empresaId
        ) ?? null;

    const identificacionInvalida =
        mostrarErrores && !formulario.identificacion.trim();

    const nombresInvalidos =
        mostrarErrores && !formulario.nombresApellido.trim();

    const empresaInvalida =
        mostrarErrores && !formulario.empresaId;

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();

        setMostrarErrores(true);

        if (
            !formulario.identificacion.trim() ||
            !formulario.nombresApellido.trim() ||
            !formulario.empresaId
        ) {
            return;
        }

        await onGuardar({
            identificacion: formulario.identificacion.trim(),
            nombresApellido: formulario.nombresApellido.trim(),
            telefono: formulario.telefono.trim(),
            idTipoEmpleado: formulario.idTipoEmpleado.trim(),
            nombreUsuario: formulario.nombreUsuario.trim(),
            empresaId: formulario.empresaId
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                <DialogTitle>
                    {empleado
                        ? 'Editar empleado'
                        : 'Nuevo empleado'}
                </DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Identificación"
                                value={formulario.identificacion}
                                onChange={event =>
                                    setFormulario(current => ({
                                        ...current,
                                        identificacion: event.target.value
                                    }))
                                }
                                error={identificacionInvalida}
                                helperText={
                                    identificacionInvalida
                                        ? 'La identificación es obligatoria.'
                                        : ''
                                }
                                fullWidth
                                size="small"
                                autoFocus
                            />
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            <TextField
                                label="Nombres y apellidos"
                                value={formulario.nombresApellido}
                                onChange={event =>
                                    setFormulario(current => ({
                                        ...current,
                                        nombresApellido: event.target.value
                                    }))
                                }
                                error={nombresInvalidos}
                                helperText={
                                    nombresInvalidos
                                        ? 'Los nombres y apellidos son obligatorios.'
                                        : ''
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Teléfono"
                                value={formulario.telefono}
                                onChange={event =>
                                    setFormulario(current => ({
                                        ...current,
                                        telefono: event.target.value.replace(/\D/g, '')
                                    }))
                                }
                                inputProps={{
                                    maxLength: 15
                                }}
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Tipo de empleado"
                                value={formulario.idTipoEmpleado}
                                onChange={event =>
                                    setFormulario(current => ({
                                        ...current,
                                        idTipoEmpleado: event.target.value
                                    }))
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Nombre de usuario"
                                value={formulario.nombreUsuario}
                                onChange={event =>
                                    setFormulario(current => ({
                                        ...current,
                                        nombreUsuario: event.target.value
                                    }))
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12}>
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
                                        empresaId: String(value?.id ?? '')
                                    }))
                                }
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

export default EmpleadoFormDialog;