import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

// Token localStorage'da tutulur — AuthContext ile birebir aynı kaynak.
// Tüm sekmelerde oturum kalıcı olarak korunur.
const TOKEN_KEY = "token";

// ── Request Interceptor ──
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 → token expired / invalid
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
