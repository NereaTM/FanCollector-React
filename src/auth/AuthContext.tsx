import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { AuthUser, RegisterRequest } from "../types/auth";
import { loginRequest, registerRequest } from "../data/authApi";
import { getToken, saveToken, clearSession, getIdFromToken } from "./authStorage";
import { getUsuarioById } from "../data/usuariosApi";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loadingSession: boolean;
  sessionChecked: boolean;
  login: (email: string, contrasena: string) => Promise<void>;
  register: (dto: RegisterRequest) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loadingSession: true,
  sessionChecked: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(getToken());
  const [loadingSession, setLoadingSession] = useState(true);
  // si no hay token válido ya sabemos la respuesta sin hacer nada más
  const [sessionChecked, setSessionChecked] = useState(() => {
    return !getToken() || !getIdFromToken();
  });

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const savedToken = getToken();
    const tokenId = getIdFromToken();

    if (!savedToken || !tokenId) {
      clearSession();
      setLoadingSession(false);
      setSessionChecked(true);
      return;
    }

    // Hay sesión válidaRequireAuth deja pasar y los datos llegan más tarde

    setSessionChecked(true);

    getUsuarioById(tokenId)
      .then((me) => setUser(me))
      .catch(() => logout())
      .finally(() => setLoadingSession(false));
  }, [logout]);

  const login = useCallback(async (email: string, contrasena: string) => {
    const data = await loginRequest(email, contrasena);
    saveToken(data.token);
    const me = await getUsuarioById(data.id);
    setToken(data.token);
    setUser(me);
  }, []);

  const register = useCallback(async (dto: RegisterRequest) => {
    await registerRequest(dto);
    await login(dto.email, dto.contrasena);
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, token, loadingSession, sessionChecked, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}