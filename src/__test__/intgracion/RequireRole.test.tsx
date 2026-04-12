import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import RequireRole from "../../auth/RequireRole";
import type { AuthUser } from "../../types/auth";

// allowedRoles por defecto es ["ADMIN"] para no repetirlo en cada test
function renderConContexto(user: AuthUser | null, allowedRoles = ["ADMIN"]) {
  return render(
    <AuthContext.Provider
      value={{
        token: "token-valido",
        user,
        sessionChecked: true,
        loadingSession: false,
        login: async () => {},
        register: async () => {},
        logout: () => {},
      }}
    >
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route
            path="/admin/dashboard"
            element={
              <RequireRole allowedRoles={allowedRoles}>
                <p>Panel de admin</p>
              </RequireRole>
            }
          />
          <Route path="/" element={<p>Página de inicio</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("RequireRole", () => {
  it("renderiza los hijos si el usuario tiene rol ADMIN", () => {
    const user: AuthUser = { id: 1, nombre: "Nerea", email: "admin@test.com", rol: "ADMIN", urlAvatar: null };
    renderConContexto(user, ["ADMIN"]);
    expect(screen.getByText("Panel de admin")).toBeInTheDocument();
  });

  it("renderiza los hijos si el usuario tiene rol MODS y la ruta lo permite", () => {
    // MODS puede acceder a moderacion (allowedRoles: ADMIN + MODS) pero no al dashboard
    const user: AuthUser = { id: 3, nombre: "Sara", email: "sara@test.com", rol: "MODS", urlAvatar: null };
    renderConContexto(user, ["ADMIN", "MODS"]);
    expect(screen.getByText("Panel de admin")).toBeInTheDocument();
  });

  it("redirige a inicio si MODS intenta acceder a una ruta solo de ADMIN", () => {
    // MODS no puede entrar al dashboard, solo a moderacion
    const user: AuthUser = { id: 3, nombre: "Sara", email: "sara@test.com", rol: "MODS", urlAvatar: null };
    renderConContexto(user, ["ADMIN"]);
    expect(screen.getByText("Página de inicio")).toBeInTheDocument();
  });

  it("redirige a inicio si el usuario tiene rol USER", () => {
    // USER no tiene acceso a ninguna ruta de admin
    const user: AuthUser = { id: 2, nombre: "Juan", email: "juan@test.com", rol: "USER", urlAvatar: null };
    renderConContexto(user, ["ADMIN"]);
    expect(screen.getByText("Página de inicio")).toBeInTheDocument();
  });

  it("redirige a inicio si no hay usuario autenticado", () => {
    renderConContexto(null);
    expect(screen.getByText("Página de inicio")).toBeInTheDocument();
  });
});