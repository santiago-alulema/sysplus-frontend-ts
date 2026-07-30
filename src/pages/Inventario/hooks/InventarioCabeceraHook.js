import {
  FINISH_INVENTORY,
  GET_AGENCIES_BY_EMPLOYEE
} from '@/services/Api_Inventario/Api_TomaFisicaInventario';

import { Decrypt_User } from '@/services/Storage_Service';
import { showAlert } from '@/utils/modalAlerts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InventarioCabeceraHook = () => {
  const navigate = useNavigate();

  const [agencuasUsuarios, setAgencuasUsuarios] = useState([]);
  const [seleccionarAgencia, setSeleccionarAgencia] = useState('');
  const [objectAgencia, setObjectAgencia] = useState(null);
  const [selectNameAgencia, setSelectNameAgencia] = useState('');
  const [idAgencySelect, setIdAgencySelect] = useState('');
  const [userLogin, setUserLogin] = useState(null);

  const [openFinishAuditory, setOpenFinishAuditory] = useState(false);

  const respuestaAlert = (titulo, mensaje, type) => {
    showAlert({
      title: titulo,
      message: mensaje,
      type,
      callBackFunction: false
    });
  };

  const OnInitPage = async () => {
    const user = Decrypt_User();
    if (user === null) {
      navigate('/');
      return;
    }

    setUserLogin(user);

    try {
      const respuesta = await GET_AGENCIES_BY_EMPLOYEE(user.User);

      setAgencuasUsuarios([
        { idagencia: '0', nombreagencia: '-- SELECT --' },
        ...respuesta
      ]);
    } catch (error) {
      respuestaAlert(
        'ERROR',
        'No se pudieron cargar las agencias.',
        'error'
      );
    }
  };

  useEffect(() => {
    OnInitPage();
  }, []);

  const seleccionarAgenciaYJefeAgencia = (e) => {
    const idAgencia = e.target.value;

    setSeleccionarAgencia(idAgencia);

    const resultado = agencuasUsuarios.find(
      (item) => item.idagencia === idAgencia
    );

    if (!resultado) {
      setObjectAgencia(null);
      setSelectNameAgencia('');
      setIdAgencySelect('');
      return;
    }

    setObjectAgencia(resultado);
    setSelectNameAgencia(resultado.nombreagencia);
    setIdAgencySelect(resultado.idagencia);
  };

  const confirmInventoryFinish = () => {
    finishAutory();
  };

  const cancelConfirmInventoryFinish = () => {
    setOpenFinishAuditory(false);
  };

  const finishAutory = async () => {
    if (!idAgencySelect || idAgencySelect === '0') {
      respuestaAlert(
        'ERROR',
        "<strong style='text-align: center;'>No seleccionó agencia</strong>",
        'error'
      );
      return;
    }

    try {
      await FINISH_INVENTORY({
        agencia: idAgencySelect,
        usuario: userLogin?.User
      });

      respuestaAlert(
        'CORRECTO',
        "<strong style='text-align: center;'>Se cerró el inventario</strong>",
        'success'
      );

      setOpenFinishAuditory(false);
    } catch (error) {
      respuestaAlert(
        'ERROR',
        'No se pudo finalizar el inventario.',
        'error'
      );
    }
  };

  return {
    agencuasUsuarios,
    seleccionarAgencia,
    seleccionarAgenciaYJefeAgencia,
    objectAgencia,
    selectNameAgencia,
    idAgencySelect,
    userLogin,

    openFinishAuditory,
    setOpenFinishAuditory,
    confirmInventoryFinish,
    cancelConfirmInventoryFinish
  };
};

export default InventarioCabeceraHook;