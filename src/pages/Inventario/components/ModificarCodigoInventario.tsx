import { useEffect, useMemo, useState } from 'react';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';

import CustomDataGridTs from '@/componentesCommons/DataGridCommon/CustomDataGridTs';
import { SobranteInventario } from '../models/SobranteInventario';
import { actualizarCodigoInventario, obtenerSobrantesInventario } from '../services/ModificarCodigoInventarioService';
import { crearModificarCodigoColumns } from '../configs/ModificarCodigoInventarioColumns';
import { useLoading } from '@/componentesCommons/LoadingContext';
import { showAlert } from '@/utils/modalAlerts';




interface Props {
    tomaFisicaId: string;
}

const ModificarCodigoInventario = ({ tomaFisicaId }: Props) => {

    const [sobrantes, setSobrantes] = useState<SobranteInventario[]>([]);
    const [itemSeleccionado, setItemSeleccionado] = useState<SobranteInventario | null>(null);
    const { startLoading, stopLoading } = useLoading();
    const [codigoNuevo, setCodigoNuevo] = useState('');
    const [nombreNuevo, setNombreNuevo] = useState('');

    const cargarDatos = async () => {
        try {
            startLoading();
            const response = await obtenerSobrantesInventario(tomaFisicaId);
            setSobrantes(response);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [tomaFisicaId]);

    const editar = (item: SobranteInventario) => {
        try {
            startLoading();
            setItemSeleccionado(item);
            setCodigoNuevo(item.codigo ?? '');
            setNombreNuevo(item.nombre ?? '');

          
        } finally {
            stopLoading();
        }
    };

    const cerrarModal = () => {
        setItemSeleccionado(null);
        setCodigoNuevo('');
        setNombreNuevo('');

    };

    const guardar = async () => {

        if (!itemSeleccionado)
            return;

        if (!codigoNuevo.trim())
            return;

        try {

            await actualizarCodigoInventario(
                itemSeleccionado.id,
                codigoNuevo.trim(),
                nombreNuevo.trim()
            );

            cerrarModal();

            await cargarDatos();
              showAlert({
                title:"Correcto",
                message:"Se actualizo correctamente",
                type: "success"
            })

        } catch (error) {
            console.error(error);
        }
    };

    const columns = useMemo(
        () => crearModificarCodigoColumns(editar),
        []
    );

    return (
        <Box sx={{ p: 2 }}>

            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    borderRadius: 2
                }}
            >

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Modificar código de inventario
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Productos sobrantes encontrados en la toma física
                        </Typography>
                    </Box>
                </Stack>

                <CustomDataGridTs
                    rows={sobrantes}
                    columns={columns}
                    gridId="grid-modificar-codigo-inventario"
                    getRowId={(row) => row.id}
                    hasFilters
                    hasPagination
                    addNumeration
                    titleEmptyTable="No existen productos sobrantes"
                />

            </Paper>

            <Dialog
                open={itemSeleccionado !== null}
                onClose={cerrarModal}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Modificar código
                </DialogTitle>

                <DialogContent>

                    <Stack spacing={2} mt={1}>

                        <TextField
                            label="Código actual"
                            value={itemSeleccionado?.codigo ?? ''}
                            disabled
                            fullWidth
                            size="small"
                        />

                         <TextField
                            label="Producto"
                            value={itemSeleccionado?.nombre ?? ''}
                            disabled
                            fullWidth
                            size="small"
                        />

                        <TextField
                            label="Nombre producto nuevo"
                            value={nombreNuevo}
                            onChange={(e) =>
                                setNombreNuevo(e.target.value)
                            }
                            fullWidth
                            size="small"
                            autoFocus
                        />

                        <TextField
                            label="Código nuevo"
                            value={codigoNuevo}
                            onChange={(e) =>
                                setCodigoNuevo(e.target.value)
                            }
                            fullWidth
                            size="small"
                            autoFocus
                        />

                    </Stack>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={cerrarModal}
                        color="inherit"
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={guardar}
                        disabled={!codigoNuevo.trim()}
                    >
                        Actualizar
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
};

export default ModificarCodigoInventario;