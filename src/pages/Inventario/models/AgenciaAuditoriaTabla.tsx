import {
    Box,
    IconButton,
    Tooltip
} from '@mui/material';

import DeleteOutlineIcon
    from '@mui/icons-material/DeleteOutline';

import EditOutlinedIcon
    from '@mui/icons-material/EditOutlined';

import {
    useMemo
} from 'react';

import CustomDataGridTs, {
    type DataGridColumn
} from '@/componentesCommons/DataGridCommon/CustomDataGridTs';

import type {
    AgenciaAuditoria
} from '../models/AgenciaAuditoria';


interface Props {

    registros: AgenciaAuditoria[];

    onEditar:
    (registro: AgenciaAuditoria) => void;

    onEliminar:
    (registro: AgenciaAuditoria) => void;
}


const AgenciaAuditoriaTabla = ({
    registros,
    onEditar,
    onEliminar
}: Props) => {


    const columns =
        useMemo<DataGridColumn<AgenciaAuditoria>[]>(
            () => [

                {
                    name: 'nombreAgencia',
                    title: 'Agencia',
                    width: 200,
                    dataType: 'text'
                },

                {
                    name: 'nombreResponsableTomaFisica',
                    title: 'Responsable toma física',
                    width: 250,
                    dataType: 'text'
                },

                {
                    name: 'nombreJefeAgencia',
                    title: 'Jefe de agencia',
                    width: 230,
                    dataType: 'text'
                },

                {
                    name: 'opciones',
                    title: 'Acciones',
                    width: 110,
                    hiddenFilterColumn: true,
                    sortingEnabled: false,

                    getCellValue: row => (

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 0.5
                            }}
                        >

                            <Tooltip title="Editar">

                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                        onEditar(row)
                                    }
                                >
                                    <EditOutlinedIcon
                                        fontSize="small"
                                    />
                                </IconButton>

                            </Tooltip>


                            <Tooltip title="Eliminar">

                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                        onEliminar(row)
                                    }
                                >
                                    <DeleteOutlineIcon
                                        fontSize="small"
                                    />
                                </IconButton>

                            </Tooltip>

                        </Box>
                    )
                }
            ],
            [
                onEditar,
                onEliminar
            ]
        );

    return (

        <CustomDataGridTs
            rows={registros}
            columns={columns}
            gridId="agencia-auditoria-grid"
            addNumeration
            hasFilters
            hasPagination
            pageSizes={[5, 10, 20]}
            initialPageSize={10}
            titleEmptyTable="No existen asignaciones"
        />
    );
};

export default AgenciaAuditoriaTabla;