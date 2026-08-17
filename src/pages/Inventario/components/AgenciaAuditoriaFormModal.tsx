import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField
} from '@mui/material';

import {
    useEffect,
    useState
} from 'react';

import type {
    AgenciaAuditoria,
    AgenciaAuditoriaInDto,
    OpcionInventario
} from '../models/AgenciaAuditoria';

import {
    actualizarAgenciaAuditoria,
    crearAgenciaAuditoria
} from '../services/agencia-auditoria.service';
import { showAlert } from '@/utils/modalAlerts';



interface Props {
    open: boolean;

    registro: AgenciaAuditoria | null;

    empresaId: string;

    tomaFisicaInventarioId: string;

    empleados: OpcionInventario[];

    agencias: OpcionInventario[];

    onClose: () => void;

    onGuardado: () => void;
}


const AgenciaAuditoriaFormModal = ({
    open,
    registro,
    empresaId,
    tomaFisicaInventarioId,
    empleados,
    agencias,
    onClose,
    onGuardado
}: Props) => {

    const [guardando, setGuardando] =
        useState(false);

    const [form, setForm] =
        useState<AgenciaAuditoriaInDto>({
            idAgencia: '',
            responsableTomaFisica: '',
            jefeAgencia: '',
            empresaId: '',
            idTomaFisicaInventario: ''
        });


    useEffect(() => {

        if (!open)
            return;

        setForm({
            idAgencia:
                registro?.idAgencia ?? '',

            responsableTomaFisica:
                registro?.responsableTomaFisica ?? '',

            jefeAgencia:
                registro?.jefeAgencia ?? '',

            empresaId,

            idTomaFisicaInventario:
                tomaFisicaInventarioId
        });

    }, [
        open,
        registro,
        empresaId,
        tomaFisicaInventarioId
    ]);


    const guardar = async () => {

        if (
            !form.idAgencia ||
            !form.responsableTomaFisica ||
            !form.jefeAgencia
        )
            return;

        setGuardando(true);

        try {

            if (registro) {

                await actualizarAgenciaAuditoria(
                    registro.id,
                    form
                );

            } else {

                await crearAgenciaAuditoria(
                    form
                );
            }

            showAlert({
                title: 'Correcto',
                message: registro
                    ? 'Asignación actualizada correctamente.'
                    : 'Asignación creada correctamente.',
                type: 'success',
                callBackFunction: false
            });

            onGuardado();

            onClose();

        } finally {

            setGuardando(false);
        }
    };


    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                {registro
                    ? 'Editar asignación'
                    : 'Nueva asignación'}
            </DialogTitle>


            <DialogContent>

                <Stack
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <Autocomplete
                        options={agencias}
                        getOptionLabel={x => x.nombre}
                        isOptionEqualToValue={
                            (option, value) =>
                                option.id === value.id
                        }
                        value={
                            agencias.find(
                                x =>
                                    x.id ===
                                    form.idAgencia
                            ) ?? null
                        }
                        onChange={(_, value) =>
                            setForm(actual => ({
                                ...actual,
                                idAgencia:
                                    value?.id ?? ''
                            }))
                        }
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Agencia"
                                required
                                size="small"
                            />
                        )}
                    />


                    <Autocomplete
                        options={empleados}
                        getOptionLabel={x => x.nombre}
                        isOptionEqualToValue={
                            (option, value) =>
                                option.id === value.id
                        }
                        value={
                            empleados.find(
                                x =>
                                    x.id ===
                                    form.responsableTomaFisica
                            ) ?? null
                        }
                        onChange={(_, value) =>
                            setForm(actual => ({
                                ...actual,
                                responsableTomaFisica:
                                    value?.id ?? ''
                            }))
                        }
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Responsable toma física"
                                required
                                size="small"
                            />
                        )}
                    />


                    <Autocomplete
                        options={empleados}
                        getOptionLabel={x => x.nombre}
                        isOptionEqualToValue={
                            (option, value) =>
                                option.id === value.id
                        }
                        value={
                            empleados.find(
                                x =>
                                    x.id ===
                                    form.jefeAgencia
                            ) ?? null
                        }
                        onChange={(_, value) =>
                            setForm(actual => ({
                                ...actual,
                                jefeAgencia:
                                    value?.id ?? ''
                            }))
                        }
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Jefe de agencia"
                                required
                                size="small"
                            />
                        )}
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
                    variant="contained"
                    onClick={guardar}
                    disabled={
                        guardando ||
                        !form.idAgencia ||
                        !form.responsableTomaFisica ||
                        !form.jefeAgencia
                    }
                >
                    {guardando
                        ? 'Guardando...'
                        : 'Guardar'}
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default AgenciaAuditoriaFormModal;