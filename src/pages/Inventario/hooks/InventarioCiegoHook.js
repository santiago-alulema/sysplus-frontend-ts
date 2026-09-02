import { SAVE_PRODUCT_INVENTORY } from '@/services/Api_Inventario/Api_TomaFisicaInventario';
import { showAlert } from '@/utils/modalAlerts';
import { useMemo, useState, useEffect, useRef } from 'react';
import { TomaFisicaProducto } from '@/components/TomaInventarioFisicoComp/class/TomaFisicaProducto';

const InventarioCiegoItemHook = ({ userLogin, seleccionarAgencia }) => {
  const [codigoProducto, setCodigoProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [codProducto, setCodProducto] = useState('');
  const [counterComponent, setCounterComponent] = useState(new Date().getTime());

  const [cantidadBuenEstado, setCantidadBuenEstado] = useState(0);
  const [cantidadMalEstado, setCantidadMalEstado] = useState(0);
  const [cantidadRevision, setCantidadRevision] = useState(0);


  const [existProduct, setExistProduct] = useState(false);
  const [esSobrante, setEsSobrante] = useState(false);
  const [activarGrabar, setActivarGrabar] = useState(false);
  const grabandoRef = useRef(false);
  const idOperacionRef = useRef(null);


  const [observacion, setObservacion] = useState('');
  const [observationSelection, setObservationSelection] = useState(0);
  const [habiliatObsercacion, setHabilitarObservacion] = useState(true);

  const [isKit, setIsKit] = useState(false);
  const [estadoKit, setEstadoKit] = useState(0);
  const [observacionesKit, setObservacionesKit] = useState('');
  const [activarObservacionesKit, setActivarObservacionesKit] = useState(true);

  const [ubicacion, setUbicacion] = useState({
    rac: null,
    columna: null,
    nivel: null,
    posicion: null
  });

  const cantidad = useMemo(() => {
    return Number(cantidadBuenEstado || 0) + Number(cantidadMalEstado || 0) + Number(cantidadRevision || 0);
  }, [cantidadBuenEstado, cantidadMalEstado, cantidadRevision]);

  const respuestaAlert = (titulo, mensaje, type) => {
    showAlert({
      title: titulo,
      message: mensaje,
      type,
      callBackFunction: false
    });
  };

  const setCountProduct = (e, setValor) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');

    if (inputValue === '') {
      setValor(0);
      return;
    }

    setValor(parseInt(inputValue));
  };

  const checkProductExist = () => {
    setExistProduct((prev) => !prev);
    setCodigoProducto('');
    setDescripcion('');
    setCodProducto('');
  };

  const SelectObservation = (value) => {
    setHabilitarObservacion(value !== 5);
    setObservationSelection(value);

    if (value === 5) {
      setObservacion('');
      return;
    }

    setObservacion(value);
  };

  const CheckIsKit = (e, checked) => {
    setIsKit(checked);

    if (checked) {
      setEstadoKit(0);
    } else {
      setEstadoKit(0);
      setObservacionesKit('');
      setActivarObservacionesKit(true);
    }
  };

  const handleKitStateChange = (value) => {
    setEstadoKit(value);

    if (value === 'INCOMPLETO') {
      setObservacionesKit('');
      setActivarObservacionesKit(false);
      return;
    }

    setActivarObservacionesKit(true);
  };

  useEffect(() => {
    if (!isKit) {
      setObservacionesKit('');
      handleKitStateChange(0);
    }
  }, [isKit]);

  const generarNumeroAleatorio = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };

  const generarSobrante = (isChecked) => {
    setEsSobrante(isChecked);
    setCodigoProducto(isChecked ? `SOB-${generarNumeroAleatorio()}` : '');
  };

  const generarCodigo = () => {
    return '';
  };

  const validarFormulario = () => {
    if (!seleccionarAgencia || seleccionarAgencia === '0') {
      return 'No ha seleccionado una agencia para poder grabar.';
    }

    if (cantidad === 0) {
      return 'La cantidad no puede ser cero.';
    }

    if (!existProduct && !codProducto) {
      return 'Debe seleccionar un producto.';
    }

    if (existProduct && descripcion.trim() === '') {
      return 'Debe ingresar la descripción cuando el producto no existe.';
    }

    if (isKit && estadoKit === 0) {
      return 'No ha seleccionado el estado del kit.';
    }

    if (
      isKit &&
      estadoKit === 'INCOMPLETO' &&
      observacionesKit.trim() === ''
    ) {
      return 'El KIT está incompleto, la observación debe ser llenada.';
    }

    if (observationSelection === 5 && observacion.trim() === '') {
      return 'Seleccionó OTROS en OBSERVACIONES, la observación es obligatoria.';
    }

    if (observationSelection === 0 && cantidadMalEstado > 0) {
      return 'Seleccione el motivo del producto en mal estado';
    }

    const validarUbicacion =
      userLogin?.Parametros?.tiene_localizacion_items_inventario ?? false;

    if (validarUbicacion) {
      if (ubicacion.rac.trim().length === 0 ) {
        return 'Debe ingresar un <strong>RAC</strong> válido.';
      }

      if (ubicacion.columna.trim().length === 0 ) {
        return 'Debe ingresar una <strong>COLUMNA</strong> válida.';
      }

      if (ubicacion.nivel.trim().length === 0) {
        return 'Debe ingresar un <strong>NIVEL</strong> válido.';
      }

      if (ubicacion.posicion.trim().length === 0) {
        return 'Debe ingresar una <strong>POSICIÓN</strong> válida.';
      }
    }

    return null;
  };

  const InicializarDatos = () => {
    setCodigoProducto('');
    setDescripcion('');
    setOrganizations([]);
    setCodProducto('');
    // setCounterComponent(new Date().getTime());

    setCantidadBuenEstado(0);
    setCantidadMalEstado(0);

    setExistProduct(false);
    setEsSobrante(false);

    setObservacion('');
    setObservationSelection(0);
    setHabilitarObservacion(true);

    setIsKit(false);
    setEstadoKit(0);
    setObservacionesKit('');
    setActivarObservacionesKit(true);
    setCantidadRevision(0);
    setUbicacion({
      rac: '',
      columna: '',
      nivel: '',
      posicion: ''
    });
  };

  const InicializarDatosCambioProducto = () => {
  setCodigoProducto('');
  // NO borrar descripcion
  setOrganizations([]);

  setCantidadBuenEstado(0);
  setCantidadMalEstado(0);

  setExistProduct(false);
  setEsSobrante(false);

  setObservacion('');
  setObservationSelection(0);
  setHabilitarObservacion(true);

  setIsKit(false);
  setEstadoKit(0);
  setObservacionesKit('');
  setActivarObservacionesKit(true);

  setCantidadRevision(0);

  setUbicacion({
    rac: '',
    columna: '',
    nivel: '',
    posicion: ''
  });
};

  useEffect(() => {
    InicializarDatosCambioProducto();
  }, [codProducto])

  const grabarItem = async () => {

     if (grabandoRef.current) {
        return false;
      }



    const error = validarFormulario();

    if (error) {
      respuestaAlert('ERROR', error, 'error');
      return false;
    }

    grabandoRef.current = true;
  setActivarGrabar(true);

     if (!idOperacionRef.current) {
      idOperacionRef.current = crypto.randomUUID();
    }

    try {


      const tomaFisicaProducto = new TomaFisicaProducto(
        !existProduct ? codProducto : codigoProducto,
        descripcion.replace("'", ''),
        String(cantidadBuenEstado ?? '0'),
        String(cantidadMalEstado ?? '0'),
        '',
        '',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        `Observación: ${observacion} ; Observación KIT: ${observacionesKit.trim() || 'SIN OBSERVACIONES'
        }`,
        '0',
        String(parseInt(cantidad)),
        '',
        '0',
        String(generarCodigo()),
        String(userLogin?.User),
        String(seleccionarAgencia),
        'SIN LOCALIZACION',
        `Estado del KIT: ${estadoKit}`,
        `${ubicacion.rac}`,
        `${ubicacion.columna}`,
        `${ubicacion.nivel}`,
        `${ubicacion.posicion}`,
        `${cantidadRevision}`,
        idOperacionRef.current
      );

      const resp = await SAVE_PRODUCT_INVENTORY(tomaFisicaProducto);

      InicializarDatos();
      idOperacionRef.current = null;

      respuestaAlert('CORRECTO', resp, 'success');
      return true;

    } catch (error) {
      respuestaAlert(
        'ERROR',
        error?.msg ?? 'Error al guardar el producto.',
        'error'
      );
      return false;

    }finally {

    grabandoRef.current = false;
    setActivarGrabar(false);
  }
  };

  const estiloLaberBuenMalEstado = (estado) => {
    return {
      '& label': {
        color: estado,
        fontWeight: 'bold'
      },
      '& label.Mui-focused': {
        color: estado
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: estado
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: estado
      }
    };
  };

  return {
    seleccionarAgencia,
    userLogin,

    codigoProducto,
    setCodigoProducto,
    codProducto,
    setCodProducto,
    descripcion,
    setDescripcion,
    organizations,
    setOrganizations,
    counterComponent,

    cantidad,
    cantidadBuenEstado,
    setCantidadBuenEstado,
    cantidadMalEstado,
    setCantidadMalEstado,
    setCountProduct,

    existProduct,
    checkProductExist,
    esSobrante,
    generarSobrante,

    observacion,
    setObservacion,
    observationSelection,
    SelectObservation,
    habiliatObsercacion,

    isKit,
    CheckIsKit,
    estadoKit,
    handleKitStateChange,
    observacionesKit,
    setObservacionesKit,
    activarObservacionesKit,

    ubicacion,
    setUbicacion,
    cantidadRevision,
    setCantidadRevision,
    estiloLaberBuenMalEstado,
    grabarItem
  };
};

export default InventarioCiegoItemHook;