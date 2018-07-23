import axios from "axios";
import config from "./config";
export const apiInstance = options => {
  const axiosInstance = axios.create({
    baseURL: config.serverUrl,
    withCredentials: false,
    timeout: 1000 * 5
  });
  return axiosInstance(options);
};
