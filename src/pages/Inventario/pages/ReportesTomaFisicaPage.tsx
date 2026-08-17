import BasePage from '@/componentesCommons/BasePage'
import ReportesAuditoriaEmpresasComponent from '@/pages/Inventario/components/ReportesAuditoriaEmpresasComponent'
import React from 'react'

const ReportesTomaFisicaPage = () => {
    return (
        <BasePage title='Seleccione la empresa y la toma física para generar los reportes.'>
            <ReportesAuditoriaEmpresasComponent />
        </BasePage>
    )
}

export default ReportesTomaFisicaPage