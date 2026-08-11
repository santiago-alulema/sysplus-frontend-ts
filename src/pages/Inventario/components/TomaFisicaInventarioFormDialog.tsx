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
    EmpresaOption,
    TomaFisicaInventario,
    TomaFisicaInventarioFormData
} from '../models/TomaFisicaInventarioModel';
import { ESTATUS_TOMA_FISICA } from '@/pages/Inventario/configs/TomaFisicaInventarioConfig';
import CustomAutocompleteTs from '@/componentesCommons/DataGridCommon/CustomAutocompleteTs';

interface Props {
    open: boolean;
    tomaFisica: TomaFisicaInventario | null;
    empresas: EmpresaOption[];
    guardando: boolean;
    onClose: () => void;
    onGuardar: (
        data: TomaFisicaInventarioFormData
    ) => Promise<void>;
}

const FORMULARIO_INICIAL: TomaFisicaInventarioFormData = {
    nombre: '',
    estatus: 'PENDIENTE',
    fechaInicio: null,
    fechaFin: null,
    empresaId: ''
};

const obtenerFechaInput = (
    fecha: string | null | undefined
): string => {
    return fecha?.substring(0, 10) ?? '';
};

const TomaFisicaInventarioFormDialog = ({
    open,
    tomaFisica,
    empresas,
    guardando,
    onClose,
    onGuardar
}: Props) => {
    const [formulario, setFormulario] =
        useState<TomaFisicaInventarioFormData>(
            FORMULARIO_INICIAL
        );

    const [mostrarErrores, setMostrarErrores] =
        useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setFormulario({
            nombre: tomaFisica?.nombre ?? '',
            estatus: tomaFisica?.estatus ?? 'PENDIENTE',
            fechaInicio: obtenerFechaInput(
                tomaFisica?.fechaInicio
            ),
            fechaFin: obtenerFechaInput(
                tomaFisica?.fechaFin
            ),
            empresaId: tomaFisica?.empresaId ?? ''
        });

        setMostrarErrores(false);
    }, [open, tomaFisica]);

    const empresaSeleccionada =
        empresas.find(
            empresa => empresa.id === formulario.empresaId
        ) ?? null;

    const estatusSeleccionado =
        ESTATUS_TOMA_FISICA.find(
            estatus => estatus.id === formulario.estatus
        ) ?? null;

    const nombreInvalido =
        mostrarErrores && !formulario.nombre.trim();

    const empresaInvalida =
        mostrarErrores && !formulario.empresaId;

    const fechaFinInvalida =
        mostrarErrores &&
        Boolean(formulario.fechaInicio) &&
        Boolean(formulario.fechaFin) &&
        formulario.fechaFin! < formulario.fechaInicio!;

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();

        setMostrarErrores(true);

        if (
            !formulario.nombre.trim() ||
            !formulario.empresaId ||
            fechaFinInvalida
        ) {
            return;
        }

        await onGuardar({
            nombre: formulario.nombre.trim(),
            estatus: formulario.estatus,
            fechaInicio: formulario.fechaInicio || null,
            fechaFin: formulario.fechaFin || null,
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
                <DialogTitle color='black'>
                    {tomaFisica
                        ? 'Editar toma física'
                        : 'Nueva toma física'}
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
                            fullWidth
                            size="small"
                            autoFocus
                        />

                        <CustomAutocompleteTs
                            label="Empresa"
                            labelFullField="Empresa"
                            options={empresas}
                            defaultValue={empresaSeleccionada}
                            optionValue="id"
                            optionLabel="nombre"
                            requiredField
                            disabled={Boolean(tomaFisica)}
                            errorField={empresaInvalida}
                            message="La empresa es obligatoria."
                            handleChange={(_, value) =>
                                setFormulario(current => ({
                                    ...current,
                                    empresaId: String(value?.id ?? '')
                                }))
                            }
                        />

                        <CustomAutocompleteTs
                            label="Estatus"
                            labelFullField="Estatus"
                            options={ESTATUS_TOMA_FISICA}
                            defaultValue={estatusSeleccionado}
                            optionValue="id"
                            optionLabel="nombre"
                            requiredField
                            handleChange={(_, value) =>
                                setFormulario(current => ({
                                    ...current,
                                    estatus: String(
                                        value?.id ?? 'PENDIENTE'
                                    )
                                }))
                            }
                        />

                        <Stack
                            direction={{
                                xs: 'column',
                                sm: 'row'
                            }}
                            spacing={2}
                        >
                            <TextField
                                label="Fecha de inicio"
                                type="date"
                                value={formulario.fechaInicio ?? ''}
                                onChange={event =>
                                    setFormulario(current => ({
                                        ...current,
                                        fechaInicio:
                                            event.target.value || null
                                    }))
                                }
                                fullWidth
                                size="small"
                            />

                            <TextField
                                label="Fecha de fin"
                                type="date"
                                value={formulario.fechaFin ?? ''}
                                onChange={event =>
                                    setFormulario(current => ({
                                        ...current,
                                        fechaFin:
                                            event.target.value || null
                                    }))
                                }
                                error={fechaFinInvalida}
                                helperText={
                                    fechaFinInvalida
                                        ? 'La fecha de fin es incorrecta.'
                                        : ''
                                }
                                fullWidth
                                size="small"
                            />
                        </Stack>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button
                        color='error'
                        onClick={onClose}
                        disabled={guardando}
                        variant="contained"
                    >
                        Cancelar
                    </Button>

                    <Button
                        color='success'
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

export default TomaFisicaInventarioFormDialog;