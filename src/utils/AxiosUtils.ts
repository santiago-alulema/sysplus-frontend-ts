import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { showAlert } from './modalAlerts';
import { BASE_URL, BASE_URL_WHATSAPP_WEB } from './EnvUrl';
import { Decrypt_User } from '@/services/Storage_Service';


const api = (prefix = '', isUrlWhatApp = false) => {
  const user = Decrypt_User();
  console.log(user.Token);

  const instance = axios.create({
    baseURL: (isUrlWhatApp ? BASE_URL_WHATSAPP_WEB : BASE_URL) + `${prefix}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.Token}`
    }
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const msg = error.response?.headers.message
        ? `${error.response?.headers.message}`
        : `${error.response?.data || error.message}`;

      const configAlert = {
        title: "Error",
        message: msg,
        type: 'error',
        callBackFunction: false
      };
      showAlert(configAlert);

      return Promise.reject(error);
    }
  );
  return instance;
};

export const request = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: unknown,
  params?: Record<string, unknown>,
  isDownload?: boolean,
  isUrlWhatApp?: boolean
): Promise<T> => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data,
    params,
    responseType: isDownload ? 'blob' : 'json'
  };

  const response = await api('', isUrlWhatApp).request<T>(config);

  if (isDownload && response.data instanceof Blob) {
    const contentType = response.headers['content-type'];
    const contentDisposition = response.headers['content-disposition'];

    let filename = 'documento_descargado';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    const blob = new Blob([response.data], { type: contentType });

    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  return response.data;
};