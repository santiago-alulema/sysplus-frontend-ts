import BasePage from '@/componentesCommons/BasePage'
import ReportesAuditoriaEmpresasComponent from '@/pages/Inventario/components/ReportesAuditoriaEmpresasComponent'
import React from 'react'

const ReportesTomaFisicaPage = () => {
    return (
        <BasePage title='REPORTE TOMA FISICA'>
            <ReportesAuditoriaEmpresasComponent />
        </BasePage>
    )
}

export default ReportesTomaFisicaPage