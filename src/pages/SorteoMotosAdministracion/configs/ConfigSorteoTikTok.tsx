import { DataGridColumn } from '@/componentesCommons/CustomDataGridTs';
import { sorteoDtoIn } from '@/pages/SorteoMotosAdministracion/models/sorteoDtoIn';
import { useMemo } from 'react';

export const ConfigSorteoTikTok = () => {

    const columns = useMemo<DataGridColumn<sorteoDtoIn>[]>(
        () => [
            {
                name: 'ci',
                title: 'Cedula',
                width: '10%',
                align: 'center',
                getCellValue: (row: sorteoDtoIn) => {
                    const ci = String(row.ci ?? '');
                    if (ci.length <= 4) return '*'.repeat(ci.length);
                    return '*'.repeat(ci.length - 4) + ci.slice(-4);
                }
            },
            {
                name: 'nombrepropietario',
                title: 'Cliente',
                width: '26%',
                align: 'left'
            },
            {
                name: 'agencia',
                title: 'Agencia',
                width: '30%',
                align: 'left'
            },
            {
                name: 'factura',
                title: 'Factura',
                width: '20%',
                align: 'left'
            },
            {
                name: 'fecha',
                title: 'Fecha',
                width: '10%',
                align: 'left'
            },
            {
                name: 'celular',
                title: 'Celular',
                width: '10%',
                align: 'left',
                getCellValue: (row: sorteoDtoIn) => {
                    const ci = String(row.ci ?? '');
                    if (ci.length <= 4) return '*'.repeat(ci.length);
                    return '*'.repeat(ci.length - 4) + ci.slice(-4);
                }
            }
        ],
        []
    );

    return columns;
};
