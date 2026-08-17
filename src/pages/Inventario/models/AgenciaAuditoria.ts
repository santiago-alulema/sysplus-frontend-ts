export interface AgenciaAuditoria {
    id: string;

    idAgencia?: string;
    nombreAgencia?: string;

    responsableTomaFisica?: string;
    nombreResponsableTomaFisica?: string;

    jefeAgencia?: string;
    nombreJefeAgencia?: string;

    idTomaFisicaInventario?: string;

    empresaId?: string;
}

export interface AgenciaAuditoriaInDto {
    idAgencia: string;

    responsableTomaFisica: string;

    jefeAgencia: string;

    idTomaFisicaInventario: string;

    empresaId: string;
}

export interface OpcionInventario {
    id: string;
    nombre: string;
}