import { EmpresaOption } from '@/pages/Inventario/models/agencia.model';
import AdministracionInventarioEndPoint from '@/pages/Inventario/services/AdministracionInventarioEndPoint';
import { request } from '@/utils/AxiosUtils';



interface EmpresaResponse {
    id: string;
    nombre: string | null;
    esta_activo: boolean | null;
}

export const obtenerEmpresas = async (): Promise<EmpresaOption[]> => {
    const empresas = await request<EmpresaResponse[]>(
        'get',
        AdministracionInventarioEndPoint.OBTENER_TODAS
    );

    return empresas
        .filter(empresa => empresa.esta_activo !== false)
        .map(empresa => ({
            id: empresa.id,
            nombre: empresa.nombre ?? 'Empresa sin nombre'
        }));
};