import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import RequireAuth from "../../auth/RequireAuth";

// Se simula el context y los valores del rquerireAuth
function renderConContexto(token: string | null, sessionChecked: boolean) {
  return render(
    <AuthContext.Provider
      value={{
        token,
        sessionChecked,
        user: null,
        loadingSession: false,
        login: async () => {},
        register: async () => {},
        logout: () => {},
      }}
    >
      <MemoryRouter initialEntries={["/protegida"]}>
        <Routes>
          <Route
            path="/protegida"
            element={
              <RequireAuth>
                <p>Contenido protegido</p>
              </RequireAuth>
            }
          />
          <Route path="/login" element={<p>Página de login</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("RequireAuth", () => {
  it("muestra el estado de carga mientras sessionChecked es false", () => {
    // Mientras se verifica el token en localStorage no debe mostrar ni redirigir nada
    renderConContexto(null, false);
    expect(screen.getByText(/cargando sesión/i)).toBeInTheDocument();
  });

  it("redirige a login si no hay token", () => {
    // Sesión ya verificada pero sin token: usuario no autenticado
    renderConContexto(null, true);
    expect(screen.getByText("Página de login")).toBeInTheDocument();
  });

  it("renderiza los hijos si hay token", () => {
    // Con token válido la ruta protegida es accesible
    renderConContexto("token-valido", true);
    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
  });
});