import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import {
    IconButton,
    Stack,
    Tooltip
} from '@mui/material';

import type { DataGridColumn }
    from '@/componentesCommons/DataGridCommon/CustomDataGridTs';

import type { AgenciaTomaFisicaInventario }
    from '@/pages/Inventario/models/agenciasTomaFisicaInventario.model';


export const crearAgenciasTomaFisicaInventarioColumns = (
    onEditar: (
        agencia: AgenciaTomaFisicaInventario
    ) => void
): DataGridColumn<AgenciaTomaFisicaInventario>[] => [
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
            getCellValue: row =>
                row.descripcion ?? ''
        },
        {
            name: 'empresa',
            title: 'Empresa',
            width: '25%',
            dataType: 'text',
            getCellValue: row =>
                row.empresa?.nombre ?? 'Sin empresa'
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
                </Stack>
            )
        }
    ];