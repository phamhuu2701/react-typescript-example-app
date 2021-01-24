import axios from 'axios';
import { USER_TOKEN } from './localStorage';
import { CONFIG } from '../config';

export const callApi = async (endpoint: string, method: any = 'GET', data?: any, header?: any) => {
  try {
    const res = await axios({
      url: endpoint,
      method,
      data,
      headers: {
        ...(header ? header : {}),
        // Accept: 'application/json',
        // 'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + USER_TOKEN.get(),
      },
      baseURL: CONFIG.API_BASE_URL,
    });

    return res.data;
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data
        ? error.response.data
        : { message: error.message },
    };
  }
};