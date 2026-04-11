const TOKEN_KEY = "auth_token";
const USER_ID_KEY = "auth_user_id";

// Token
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

// Limpia toda la sesión
export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

// User ID
export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function saveUserId(id: number | string): void {
  localStorage.setItem(USER_ID_KEY, String(id));
}

// Extrae el id que viene dentro del JWT sin necesidad de llamar a la API
export function getIdFromToken(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id != null ? String(payload.id) : null;
  } catch {
    return null;
  }
}
 