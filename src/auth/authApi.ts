import type { LoginResponse, RegisterRequest } from "../types/auth";

const BASE_URL = import.meta.env.VITE_API_URL as string;

// Devuelve { token, id, email, nombre, rol }
// El backend no tiene /me, por eso el login devuelve también el id del usuario
export async function loginRequest(
  email: string,
  contrasena: string
): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contrasena }),
  });

  if (!response.ok) throw new Error("Credenciales incorrectas.");

  return response.json() as Promise<LoginResponse>;
}

// El backend devuelve 201 sin token, por eso tras registrar
// el AuthContext llama a loginRequest para obtener la sesión
export async function registerRequest(dto: RegisterRequest): Promise<void> {
  const response = await fetch(`${BASE_URL}/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null) as Record<string, string> | null;
    throw new Error(data?.message ?? "No se pudo registrar el usuario.");
  }
}