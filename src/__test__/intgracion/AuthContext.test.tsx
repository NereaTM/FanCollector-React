import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../auth/AuthContext";

// Mockeamos las llamadas al backend para no hacer peticiones reales
vi.mock("../../data/authApi", () => ({
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
}));

vi.mock("../../data/usuariosApi", () => ({
  getUsuarioById: vi.fn(),
}));

import { loginRequest, registerRequest } from "../../data/authApi";
import { getUsuarioById } from "../../data/usuariosApi";

const usuarioMock = {
  id: 1,
  nombre: "Juan",
  email: "juan@test.com",
  rol: "USER" as const,
  urlAvatar: null,
};

// Componente para no usar la UI real
function ComponenteDeTest() {
  const { user, token, loadingSession, sessionChecked, login, logout, register } = useAuth();
  return (
    <div>
      <p data-testid="user">{user ? user.email : "sin-usuario"}</p>
      <p data-testid="token">{token ?? "sin-token"}</p>
      <p data-testid="loading">{loadingSession ? "cargando" : "listo"}</p>
      <p data-testid="checked">{sessionChecked ? "checked" : "no-checked"}</p>
      <button onClick={() => login("juan@test.com", "1234")}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => register({ nombre: "Juan", email: "juan@test.com", contrasena: "1234" })}>Register</button>
    </div>
  );
}

function renderConProvider() {
  return render(
    <AuthProvider>
      <ComponenteDeTest />
    </AuthProvider>
  );
}

// Limpiamos el estado entre tests para que no se contaminen entre sí
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("AuthContext", () => {
  it("sin token en localStorage arranca sin usuario y sessionChecked true", async () => {
    renderConProvider();
    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("sin-usuario");
      expect(screen.getByTestId("token").textContent).toBe("sin-token");
      expect(screen.getByTestId("checked").textContent).toBe("checked");
    });
  });

  it("con token válido en localStorage carga el usuario", async () => {
    // Simulamos que ya había una sesión guardada del navegador
    const payload = btoa(JSON.stringify({ id: 1 }));
    localStorage.setItem("auth_token", `header.${payload}.sig`);
    vi.mocked(getUsuarioById).mockResolvedValue(usuarioMock);

    renderConProvider();

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("juan@test.com");
    });
  });

  it("si getUsuarioById falla limpia la sesión", async () => {
    // Si el token existe pero el backend lo rechaza, debe cerrarse la sesión
    const payload = btoa(JSON.stringify({ id: 1 }));
    localStorage.setItem("auth_token", `header.${payload}.sig`);
    vi.mocked(getUsuarioById).mockRejectedValue(new Error("fallo"));

    renderConProvider();

    await waitFor(() => {
      expect(screen.getByTestId("token").textContent).toBe("sin-token");
      expect(localStorage.getItem("auth_token")).toBeNull();
    });
  });

  it("login guarda el token y carga el usuario", async () => {
    vi.mocked(loginRequest).mockResolvedValue({ token: "token-real", id: 1 });
    vi.mocked(getUsuarioById).mockResolvedValue(usuarioMock);

    renderConProvider();
    await waitFor(() => screen.getByTestId("checked").textContent === "checked");

    screen.getByRole("button", { name: "Login" }).click();

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("juan@test.com");
      expect(screen.getByTestId("token").textContent).toBe("token-real");
    });
  });

  it("logout limpia el usuario y el token", async () => {
    // Arranca sesión ya activa
    const payload = btoa(JSON.stringify({ id: 1 }));
    localStorage.setItem("auth_token", `header.${payload}.sig`);
    vi.mocked(getUsuarioById).mockResolvedValue(usuarioMock);

    renderConProvider();
    await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("juan@test.com"));

    // Se envuelve con act por actualizaciones de estado de react
    await act(async () => {
        screen.getByRole("button", { name: "Logout" }).click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("sin-usuario");
      expect(screen.getByTestId("token").textContent).toBe("sin-token");
    });
  });

  it("register llama a registerRequest y después hace login automático", async () => {
    // el resgistro termina con sesion iniciada sin que el user haga nada 
    vi.mocked(registerRequest).mockResolvedValue(undefined);
    vi.mocked(loginRequest).mockResolvedValue({ token: "token-registro", id: 1 });
    vi.mocked(getUsuarioById).mockResolvedValue(usuarioMock);

    renderConProvider();

    screen.getByRole("button", { name: "Register" }).click();

    await waitFor(() => {
      expect(registerRequest).toHaveBeenCalledTimes(1);
      expect(loginRequest).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("user").textContent).toBe("juan@test.com");
    });
  });
});