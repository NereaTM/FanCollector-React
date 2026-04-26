import { getToken, clearSession } from "../auth/authStorage";

const BASE_URL = import.meta.env.VITE_API_URL as string;

// Error personalizado
export class ApiError extends Error {
  status: number;
  data: unknown;
  // Errores por campo
  fieldErrors: Record<string, string>;

  // La API devuelve: { statusCode, message, errors: { campo: "msg" } }
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    const raw = data as Record<string, unknown> | null;
    this.fieldErrors =
      raw && typeof raw.errors === "object" && raw.errors !== null
        ? (raw.errors as Record<string, string>)
        : {};
  }
}

// Extrae mensaje legible de cualquier error capturado en catch (API), sino mnsg gral
export function getApiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const campos = Object.entries(err.fieldErrors);
    if (campos.length > 0) {
      return campos.map(([campo, msg]) => `${campo}: ${msg}`).join("\n");
    }
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return "Error desconocido";
}

// Cliente base para llamadas a la API
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown> | FormData;
};

// Headers básicos + token si existe
export async function fetchAPI<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: "application/json",
    // FormData gestiona el Content-Type
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && options.body && { "Content-Type": "application/json" }),
  };

  const requestBody: BodyInit | undefined = isFormData
    ? (options.body as FormData)
    : options.body
    ? JSON.stringify(options.body)
    : undefined;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method ?? "GET",
    headers,
    body: requestBody,
  });

  let data: unknown = null;
  try {
    const isJson = response.headers.get("content-type")?.includes("application/json");
    data = isJson ? await response.json() : await response.text();
  } catch {}

  if (!response.ok) {
    if (response.status === 401 && endpoint !== "/auth/login") {
      clearSession();
      window.location.href = "/login";
      throw new ApiError("Sesión expirada", 401, data);
    }

    throw new ApiError(
      (data as any)?.message ?? `HTTP ${response.status}`,
      response.status,
      data
    );
  }

  return data as T;
}