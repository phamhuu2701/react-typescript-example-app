import { callApi } from '../utils/apiCaller';

const register = async (data: object | any) => {
  let formData = new FormData();
  Object.keys(data).forEach((key) => formData.append(key, data[key]));
  return await callApi('/users', 'POST', formData);
};

const login = async (data: { username: string, password: string }) => {
  let formData = new FormData();
  formData.append('username', data.username);
  formData.append('password', data.password);
  return await callApi('/users/login', 'POST', formData);
};

const getUserByToken = async () => {
  return await callApi('/users/me', 'POST');
};

const loginFacebook = async (data: object | any) => {
  let formData = new FormData();
  Object.keys(data).forEach((key) => formData.append(key, data[key]));
  return await callApi('/users/login-facebook', 'POST', formData);
};

const loginGoogle = async (data: object | any) => {
  let formData = new FormData();
  Object.keys(data).forEach((key) => formData.append(key, data[key]));
  return await callApi('/users/login-google', 'POST', formData);
};

const AuthApi = {
  register,
  login,
  getUserByToken,
  loginFacebook,
  loginGoogle,
};

export default AuthApi;