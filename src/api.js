import axios from "axios";
import config from "../config/config";
export const apiInstance = options => {
  const axiosInstance = axios.create({
    baseURL: config.serverUrl,
    withCredentials: true,
    timeout: 1000 * 5
  });
  return axiosInstance(options);
};
