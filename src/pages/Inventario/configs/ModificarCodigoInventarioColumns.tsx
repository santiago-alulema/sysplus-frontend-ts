import { DataGridColumn } from '@/componentesCommons/DataGridCommon/CustomDataGridTs';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { IconButton, Tooltip } from '@mui/material';
import { SobranteInventario } from '../models/SobranteInventario';

export const crearModificarCodigoColumns = (
    onEditar: (item: SobranteInventario) => void
): DataGridColumn<SobranteInventario>[] => [
    {
        name: 'codigo',
        title: 'Código',
        width: 180,
        dataType: 'text'
    },
    {
        name: 'nombre',
        title: 'Producto',
        width: '40%',
        dataType: 'text'
    },
    {
        name: 'bodega',
        title: 'Bodega',
        width: '30%',
        dataType: 'text'
    },
    {
        name: 'acciones',
        title: 'Acciones',
        width: 100,
        align: 'center',
        alignHeader: 'center',
        hiddenFilterColumn: true,
        sortingEnabled: false,
        getCellValue: row => (
            <Tooltip title="Cambiar código">
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEditar(row)}
                >
                    <EditOutlinedIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        )
    }
];