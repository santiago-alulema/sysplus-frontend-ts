import { DataGridColumn } from '@/componentesCommons/DataGridCommon/CustomDataGridTs';
import { EmpleadoInventario } from '@/pages/Inventario/models/EmpleadoInventarioModel';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import {
    IconButton,
    Stack,
    Tooltip
} from '@mui/material';


export const crearEmpleadoColumns = (
    onEditar: (empleado: EmpleadoInventario) => void,
): DataGridColumn<EmpleadoInventario>[] => [
        {
            name: 'identificacion',
            title: 'Identificación',
            width: 140,
            dataType: 'text'
        },
        {
            name: 'nombresApellido',
            title: 'Nombres y apellidos',
            width: '25%',
            dataType: 'text'
        },
        {
            name: 'telefono',
            title: 'Teléfono',
            width: 130,
            dataType: 'text',
            getCellValue: row => row.telefono ?? ''
        },
        {
            name: 'idTipoEmpleado',
            title: 'Tipo de empleado',
            width: 150,
            dataType: 'text',
            getCellValue: row => row.idTipoEmpleado ?? ''
        },
        {
            name: 'nombreUsuario',
            title: 'Usuario',
            width: 140,
            dataType: 'text',
            getCellValue: row => row.nombreUsuario ?? ''
        },
        {
            name: 'empresaNombre',
            title: 'Empresa',
            width: '20%',
            dataType: 'text'
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