import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

// Token sessionStorage'da tutulur — AuthContext ile birebir aynı kaynak.
// (Daha önce burada localStorage kullanılıyordu; AuthContext sessionStorage'a
// geçince uyumsuzluk oluştu: login sonrası token bulunamayıp 401 + login'e
// geri atılıyordu. Tek kaynak: sessionStorage.)
const TOKEN_KEY = "token";

// ── Request Interceptor ──
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem(TOKEN_KEY);
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
      sessionStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
