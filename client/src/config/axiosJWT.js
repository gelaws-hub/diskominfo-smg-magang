import axios from 'axios';

const axiosJWT = axios.create();


axiosJWT.interceptors.request.use(async (config) => {
  try {
    const response = await axios.get("https://api.diskominfo-smg-magang.cloud/account/token");
    config.headers.Authorization = `Bearer ${response.data.token}`;
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});
export default axiosJWT;