import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import {
    Chip,
    IconButton,
    Stack,
    Tooltip
} from '@mui/material';


import type {
    TomaFisicaInventario
} from '../models/TomaFisicaInventarioModel';
import { DataGridColumn } from '@/componentesCommons/CustomDataGridTs';

const formatearFecha = (
    fecha: string | null
): string => {
    if (!fecha) {
        return '';
    }

    const fechaSinHora = fecha.substring(0, 10);
    const partes = fechaSinHora.split('-');

    if (partes.length !== 3) {
        return fecha;
    }

    const [anio, mes, dia] = partes;

    return `${dia}/${mes}/${anio}`;
};

const obtenerTextoEstatus = (estatus: string): string => {
    switch (estatus) {
        case 'A':
            return 'Aperturado';

        case 'F':
            return 'Finalizado';
        default:
            return 'Pendiente';
    }
};

const obtenerColorEstatus = (
    estatus: string
): 'default' | 'primary' | 'success' | 'error' => {
    switch (estatus) {
        case 'A':
            return 'success';

        case 'F':
            return 'error';

        default:
            return 'default';
    }
};

export const crearTomaFisicaInventarioColumns = (
    onEditar: (tomaFisica: TomaFisicaInventario) => void,

): DataGridColumn<TomaFisicaInventario>[] => [
        {
            name: 'nombre',
            title: 'Nombre',
            width: '22%',
            dataType: 'text'
        },
        {
            name: 'empresaNombre',
            title: 'Empresa',
            width: '18%',
            dataType: 'text'
        },
        {
            name: 'estatus',
            title: 'Estatus',
            width: 130,
            align: 'center',
            alignHeader: 'center',
            getCellValue: (row: TomaFisicaInventario) => (
                <Chip
                    label={obtenerTextoEstatus(row.estatus)}
                    color={obtenerColorEstatus(row.estatus)}
                    size="small"
                    variant="outlined"
                />
            )
        },
        {
            name: 'fechaCreacion',
            title: 'Creación',
            width: 120,
            dataType: 'date',
            getCellValue: (row: TomaFisicaInventario) =>
                formatearFecha(row.fechaCreacion)
        },
        {
            name: 'fechaInicio',
            title: 'Inicio',
            width: 110,
            dataType: 'date',
            getCellValue: (row: TomaFisicaInventario) =>
                formatearFecha(row.fechaInicio)
        },
        {
            name: 'fechaFin',
            title: 'Fin',
            width: 110,
            dataType: 'date',
            getCellValue: (row: TomaFisicaInventario) =>
                formatearFecha(row.fechaFin)
        },
        {
            name: 'acciones',
            title: 'Acciones',
            width: 110,
            align: 'center',
            alignHeader: 'center',
            hiddenFilterColumn: true,
            sortingEnabled: false,
            getCellValue: (row: TomaFisicaInventario) => (
                <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="center"
                >
                    <Tooltip title="Editar">
                        <IconButton
                            size="small"
                            onClick={() => onEditar(row)}
                        >
                            <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* <Tooltip title="Eliminar">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onEliminar(row)}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip> */}
                </Stack>
            )
        }
    ];