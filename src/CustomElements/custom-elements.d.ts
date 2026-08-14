import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {

      
      'mf-escaneo-comprobante': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;



      'mf-reporte-comprobantes': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      //rect-comprobantes

      "mf-subir-comprobantes": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      "mf-reporte-comprobantes": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      "mf-reporte-usuario-comprobante": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      

      //matriculacion

      "mf-control-matriculacion": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      "mf-subir-excel-pagos-bancos": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      "mf-subir-excel-pagos-sri": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}