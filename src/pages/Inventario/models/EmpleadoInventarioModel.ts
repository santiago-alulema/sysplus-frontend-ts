export interface EmpleadoInventario {
    id: string;
    identificacion: string;
    nombresApellido: string;
    telefono: string | null;
    idTipoEmpleado: string | null;
    nombreUsuario: string | null;
    empresaId: string;
    empresaNombre: string;
}

export interface EmpleadoInventarioFormData {
    identificacion: string;
    nombresApellido: string;
    telefono: string;
    idTipoEmpleado: string;
    nombreUsuario: string;
    empresaId: string;
}

export interface EmpresaInventarioOption {
    [key: string]: unknown;

    id: string;
    nombre: string;
}