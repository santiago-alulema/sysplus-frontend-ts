export interface TomaFisicaInventario {
    id: string;
    nombre: string;
    estatus: string;
    fechaCreacion: string | null;
    fechaInicio: string | null;
    fechaFin: string | null;
    empresaId: string;
    empresaNombre: string;
}

export interface TomaFisicaInventarioFormData {
    nombre: string;
    estatus: string;
    fechaInicio: string | null;
    fechaFin: string | null;
    empresaId: string;
}

export interface EmpresaOption {
    [key: string]: unknown;

    id: string;
    nombre: string;
}

export interface EstatusOption {
    [key: string]: unknown;

    id: string;
    nombre: string;
}