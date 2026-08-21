import {END_POINTS} from './Endpoints'
import axios from 'axios';
import {Encrypt_User} from './Storage_Service'
import { request } from '@/utils/AxiosUtils';
export const getLogin = async(LoginModel)=> {
    try {
      const response = await axios.post(END_POINTS.LOGIN, LoginModel);
      if (response.status === 200) {
        if(!response.data.DebeCambiarPassword){
          Encrypt_User(response.data)
          return null;
        }
        return response.data
      } else {
        return('ERROR: No se pudo obtener el usuario.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error('Requesasdfsadf0');
        }
      } else {
        throw new Error('Error:', error.message);
      }
    }
  }


  export const actualizarPasswordUserServicioWeb = async(updatePassword)=> {
    try {
      const response = await axios.put(END_POINTS.UPDATE_PASSWORD, updatePassword);
      if (response.status === 200) {
        if(!response.data.DebeCambiarPassword){
          return null;
        }
        return response.data
      } else {
        return('ERROR: No se pudo obtener el usuario.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error('Requesasdfsadf0');
        }
      } else {
        throw new Error('Error:', error.message);
      }
    }
  }


  // export const actualizarPasswordUserServicioWeb = (inventarioNuevo) =>
  //     request(
  //         'put',
  //         `${END_POINTS.UPDATE_PASSWORD}`,
  //         inventarioNuevo
  //     );
  