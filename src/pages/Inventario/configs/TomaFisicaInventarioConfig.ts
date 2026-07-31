import type {
    EstatusOption
} from '../models/TomaFisicaInventarioModel';

export const ESTATUS_TOMA_FISICA: EstatusOption[] = [
    {
        id: 'A',
        nombre: 'Aperturado'
    },
    {
        id: 'F',
        nombre: 'Finalizado'
    }
];