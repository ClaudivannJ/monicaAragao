// src/api.js
import axios from "axios";

// Cria uma instância do axios com a URL base do backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true, // Importante para cookies de autenticação
});

// Interceptor para adicionar o token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou não autorizado
      localStorage.removeItem("token");
      window.location.href = "/pages/login.html"; // Redireciona para login
    }
    return Promise.reject(error);
  }
);

export default api;