import axios from "axios";

export const http = axios.create({
  baseURL: 'https://theraponto.dev.thera.com.br:4433/api'
});

http.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);