// src/auth/AuthContext.tsx

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { AuthUser, RegisterRequest } from "../types/auth";
import { loginRequest, registerRequest } from "./authApi";
import { getToken, saveToken, getUserId, saveUserId, clearSession } from "./authStorage";
import { fetchAPI } from "../data/apiClient";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loadingSession: boolean;
  login: (email: string, contrasena: string) => Promise<void>;
  register: (dto: RegisterRequest) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null, token: null, loadingSession: true,
  login: async () => {}, register: async () => {}, logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(getToken());
  const [loadingSession, setLoadingSession] = useState(true);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  // Al iniciar la app, recuperamos el usuario si hay sesión
  useEffect(() => {
    const savedToken = getToken();
    const savedId = getUserId();
    if (!savedToken || !savedId) { setLoadingSession(false); return; }

    fetchAPI<AuthUser>(`/usuarios/${savedId}`)
      .then((me) => { setUser(me); setToken(savedToken); })
      .catch(() => logout())
      .finally(() => setLoadingSession(false));
  }, [logout]);

  const login = useCallback(async (email: string, contrasena: string) => {
    const data = await loginRequest(email, contrasena);
    saveToken(data.token);
    saveUserId(data.id);
    setToken(data.token);
    // Usamos los datos del login para no hacer otra petición
    setUser({ id: data.id, email: data.email, nombre: data.nombre, rol: data.rol, urlAvatar: null });
  }, []);

  const register = useCallback(async (dto: RegisterRequest) => {
    await registerRequest(dto);
    await login(dto.email, dto.contrasena);
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, token, loadingSession, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}