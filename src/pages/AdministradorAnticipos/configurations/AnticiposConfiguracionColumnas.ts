import { useMemo } from 'react';
import { AnticiposPorLiquidarInDto } from '../models/AnticiposPorLiquidarInDto';
import { DataGridColumn } from '@/componentesCommons/CustomDataGridTs';

export const AnticiposConfiguracionColumnas = () => {
    const columns = useMemo<
        readonly DataGridColumn<AnticiposPorLiquidarInDto>[]
    >(
        () => [
            {
                name: 'codigoAnticipo',
                title: 'Código Anticipo',
                width: '10%',
                align: 'center',
            },
            {
                name: 'cliente',
                title: 'Cliente',
                width: '10%',
                align: 'left',
            },
            {
                name: 'telefono',
                title: 'Teléfono',
                width: '10%',
                align: 'left',
            },
            {
                name: 'fecha',
                title: 'Fecha',
                width: '10%',
                align: 'left',
                getCellValue: (row) => {
                    if (!row.fecha) return '';

                    const date = new Date(row.fecha);

                    return new Intl.DateTimeFormat('es-EC', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    }).format(date);
                },
            },
            {
                name: 'gestor',
                title: 'Gestor',
                width: '10%',
                align: 'left',
            },
            {
                name: 'factura',
                title: 'Factura',
                width: '10%',
                align: 'left',
            },
            {
                name: 'valorMatricula',
                title: 'Valor Matrícula',
                width: '10%',
                align: 'left',
            },
            {
                name: 'ramv',
                title: 'RAMV',
                width: '10%',
                align: 'left',
            },
            {
                name: 'ciudad',
                title: 'Ciudad',
                width: '10%',
                align: 'left',
            },
            {
                name: 'actions',
                title: 'Acciones',
                getCellValue: (row) => row,
                width: '10%',
                align: 'center',
                hiddenFilterColumn: true,
            },
        ],
        []
    );

    return columns;
};