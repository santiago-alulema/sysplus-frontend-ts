import { DataGridColumn } from '@/componentesCommons/DataGridCommon/CustomDataGridTs';
import { Column } from '@devexpress/dx-react-grid';
import { useMemo } from 'react';
import { CierreCajaInDto } from '../models/CierreCajaInDto';

export const ConfiguracionColumnasCierreCajas = () => {

    const columns = useMemo<DataGridColumn<CierreCajaInDto>[] >(
        () => [
            {
                name: 'nombrecaja',
                title: 'Nombre Caja',
                width: '25%',
                align: 'center'
            },
            {
                name: 'closingdate',
                title: 'Fecha Cierre',
                width: '25%',
                align: 'left'
            },
            {
                name: 'nombreagencia',
                title: 'Agencia',
                width: '25%',
                align: 'left'
            },
            {
                name: 'actions',
                title: 'Acciones',
                getCellValue: (row: any) => row,
                width: '25%',
                align: 'center',
                hiddenFilterColumn: true
            }
        ],
        []
    );

    return columns;
};
