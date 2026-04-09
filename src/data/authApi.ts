import { fetchAPI } from "./apiClient";
import type { RegisterRequest } from "../types/auth";

export function loginRequest(email: string, contrasena: string) {
  return fetchAPI<{ token: string; id: number }>("/auth/login", {
    method: "POST",
    body: { email, contrasena },
  });
}

export function registerRequest(dto: RegisterRequest) {
  return fetchAPI("/auth/registro", {
    method: "POST",
    body: dto as Record<string, unknown>,
  });
}