export interface AgenciaTomaFisicaInventario {
    id: string;
    nombre?: string;
    descripcion?: string;
    empresaId?: string;
    empresa?: EmpresaOption;
}

export interface AgenciaTomaFisicaInventarioFormData {
    nombre: string;
    descripcion?: string;
    empresaId: string;
}

export interface EmpresaOption {
    id: string;
    nombre: string;
}