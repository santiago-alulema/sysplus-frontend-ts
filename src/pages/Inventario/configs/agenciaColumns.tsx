import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import {
    IconButton,
    Stack,
    Tooltip
} from '@mui/material';


import type {
    Agencia
} from '../models/agencia.model';
import { DataGridColumn } from '@/componentesCommons/CustomDataGridTs';

export const crearAgenciaColumns = (
    onEditar: (agencia: Agencia) => void,
): DataGridColumn<Agencia>[] => [
        {
            name: 'nombre',
            title: 'Agencia',
            width: '25%',
            dataType: 'text'
        },
        {
            name: 'descripcion',
            title: 'Descripción',
            width: '35%',
            dataType: 'text',
            getCellValue: row => row.descripcion ?? ''
        },
        {
            name: 'empresaNombre',
            title: 'Empresa',
            width: '25%',
            dataType: 'text',
            getCellValue: row =>
                row.empresaNombre ?? 'Sin empresa'
        },
        {
            name: 'acciones',
            title: 'Acciones',
            width: 120,
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