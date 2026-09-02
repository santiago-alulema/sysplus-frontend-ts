export interface AgenciaMatriculacionOption {
    [key: string]: string | null | undefined;

    id: string;
    nombre: string | null;
    descripcion: string | null;
}

export interface ValorMatriculacion {
    id: string;
    agencia: string | null;
    agenciaId: string;
    agenciaNombre: string | null;
    ciudad: string | null;
    totalMatriculacion: number | null;
    gestor: string | null;
    cedulaIdentidad: string | null;
    pagosExtraordinarios: number | null;
    agenciaDestinoId: string;
    agenciaDestinoNombre: string | null;
    username: string;
}

export interface ValorMatriculacionFormData {
    agenciaId: string;
    ciudad: string;
    totalMatriculacion: number | null;
    gestor: string;
    cedulaIdentidad: string;
    pagosExtraordinarios: number | null;
    agenciaDestinoId: string;
    username: string;
}
