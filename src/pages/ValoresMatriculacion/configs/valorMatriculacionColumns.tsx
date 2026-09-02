import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import {
    IconButton,
    Stack,
    Tooltip
} from '@mui/material';

import type { DataGridColumn } from '@/componentesCommons/DataGridCommon/CustomDataGridTs';
import type { ValorMatriculacion } from '../models/valorMatriculacion.model';

export const crearValoresMatriculacionColumns = (
    onEditar: (valor: ValorMatriculacion) => void,
    onEliminar: (valor: ValorMatriculacion) => void
): DataGridColumn<ValorMatriculacion>[] => [
    {
        name: 'username',
        title: 'Usuario',
        width: 150,
        dataType: 'text'
    },
    {
        name: 'gestor',
        title: 'Gestor',
        width: 180,
        dataType: 'text'
    },
    {
        name: 'cedulaIdentidad',
        title: 'Cédula',
        width: 130,
        dataType: 'text'
    },
    {
        name: 'agenciaNombre',
        title: 'Agencia',
        width: 180,
        dataType: 'text'
    },
    {
        name: 'agenciaDestinoNombre',
        title: 'Agencia destino',
        width: 180,
        dataType: 'text'
    },
    {
        name: 'ciudad',
        title: 'Ciudad',
        width: 140,
        dataType: 'text'
    },
    {
        name: 'totalMatriculacion',
        title: 'Total matrícula',
        width: 140,
        align: 'right',
        alignHeader: 'right',
        dataType: 'number',
        getCellValue: row => row.totalMatriculacion ?? 0
    },
    {
        name: 'pagosExtraordinarios',
        title: 'Pagos extra.',
        width: 130,
        align: 'right',
        alignHeader: 'right',
        dataType: 'number',
        getCellValue: row => row.pagosExtraordinarios ?? 0
    },
    {
        name: 'acciones',
        title: 'Acciones',
        width: 110,
        align: 'center',
        alignHeader: 'center',
        hiddenFilterColumn: true,
        sortingEnabled: false,
        getCellValue: row => (
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

                <Tooltip title="Eliminar">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => onEliminar(row)}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Stack>
        )
    }
];
