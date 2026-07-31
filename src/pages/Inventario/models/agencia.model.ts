export interface Agencia {
    id: string;
    nombre: string;
    descripcion: string | null;
    empresaId: string;
    empresaNombre: string | null;
}

export interface AgenciaFormData {
    nombre: string;
    descripcion: string;
    empresaId: string;
}

export interface EmpresaOption {
    [key: string]: string | number | null | undefined;

    id: string;
    nombre: string;
}