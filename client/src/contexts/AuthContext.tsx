import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import apiClient from "../lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  email: string;
  name: string;
  // Profil alanları (User modeliyle uyumlu — backend/models/User.js).
  // Hepsi opsiyonel: eski kullanıcılarda olmayabilir, JSON'da string olarak gelir.
  username?: string;
  profilePhoto?: string;
  coverPhoto?: string;
  bio?: string;
  city?: string;
  gender?: string;
  birthDate?: string;
  followersCount?: number;
  followingCount?: number;
  recipesCount?: number;
  preferences?: {
    diet?: string[];
    allergies?: string[];
  };
}

/** Backend'den gelen standart yanıt zarfı */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  me: () => Promise<User>;
  setUser: (user: User) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Storage helpers ──────────────────────────────────────────────────────────

const TOKEN_KEY = "token";
const USER_KEY = "user";

// localStorage kullanarak JWT ve kullanıcı verisini tüm sekmelerde kalıcı tutuyoruz.
function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function removeStoredUser(): void {
  localStorage.removeItem(USER_KEY);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [isLoading, setIsLoading] = useState<boolean>(!!getStoredToken());

  // User state'i güncellendiğinde localStorage'ı da senkronize et
  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) {
      setStoredUser(u);
    } else {
      removeStoredUser();
    }
  }, []);

  // Uygulama açıldığında mevcut token varsa kullanıcı bilgilerini çek
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    apiClient
      .get<ApiResponse<User>>("/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => {
        // Token geçersiz veya süresi dolmuş → temizle
        removeStoredToken();
        removeStoredUser();
        setToken(null);
        setUserState(null);
      })
      .finally(() => setIsLoading(false));
  }, []); // Sadece mount sırasında çalışır

  // ── login ──────────────────────────────────────────────────────────────────

  const login = useCallback(async (credentials: LoginCredentials) => {
    const res = await apiClient.post<ApiResponse<{ _id: string; name: string; email: string; token: string }>>(
      "/auth/login",
      credentials
    );

    const { token: newToken, _id, name, email } = res.data.data;

    setStoredToken(newToken);
    setToken(newToken);
    setUser({ _id, name, email });
  }, []);

  // ── logout ─────────────────────────────────────────────────────────────────

  const logout = useCallback(() => {
    removeStoredToken();
    removeStoredUser();
    setToken(null);
    setUserState(null);
  }, []);

  // ── me ─────────────────────────────────────────────────────────────────────

  const me = useCallback(async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>("/auth/me");
    setUser(res.data.data);
    return res.data.data;
  }, []);

  // ── context value ──────────────────────────────────────────────────────────

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    me,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

