import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import PasswordInput from "../components/ui/PasswordInput";
import { useAuth } from "../auth/AuthContext";
import type { RegisterRequest } from "../types/auth";


function LoginForm({ onSuccess, from }: { onSuccess: (path: string) => void; from: string }) {
  // login viene del AuthContext: llama a la API, guarda token y actualiza estado global
  const { login } = useAuth();
  const [fields, setFields] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!fields.email || !fields.password) {
      setError("Por favor, completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      await login(fields.email, fields.password);
      // Si login no lanzó error navegamos a la ruta original o a "/"
      onSuccess(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id="login" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input type="email" id="login-email" name="email" 
        className="form-input"  
        value={fields.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="login-password">Contraseña</label>
        <PasswordInput id="login-password"  name="password" 
        className="form-input"  
        value={fields.password} onChange={handleChange} />
      </div>
      {error && <div className="form-error">{error}</div>}
      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? <><i className="fas fa-spinner fa-spin" /> Entrando...</> : "Iniciar Sesión"}
      </button>
    </form>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: (path: string) => void }) {
  // register viene del AuthContext: registra y luego hace login automático
  const { register } = useAuth();
  const [fields, setFields] = useState({
    nombre: "", apellido: "", email: "", password: "", confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { nombre, apellido, email, password, confirmPassword } = fields;
    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      // contrasena (no password) para coincidir con RegisterRequest del backend
      await register({ nombre, apellido, email, contrasena: password } as RegisterRequest);
      onSuccess("/mis-colecciones");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse.");
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <form id="register" onSubmit={handleSubmit}>
      {(["nombre", "apellido"] as const).map((name) => (
        <div className="form-group" key={name}>
          <label htmlFor={`register-${name}`}>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
          <input type="text" id={`register-${name}`} name={name} className="form-input" value={fields[name]} onChange={handleChange} required />
        </div>
      ))}
      <div className="form-group">
        <label htmlFor="register-email">Email</label>
        <input type="email" id="register-email" name="email" className="form-input" value={fields.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="register-password">Contraseña</label>
        <PasswordInput id="register-password" name="password" className="form-input" value={fields.password} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="register-confirm-password">Confirmar Contraseña</label>
        <PasswordInput id="register-confirm-password" name="confirmPassword" className="form-input" value={fields.confirmPassword} onChange={handleChange} />
      </div>
      {error && <div className="form-error">{error}</div>}
      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? <><i className="fas fa-spinner fa-spin" /> Registrando...</> : "Registrarse"}
      </button>
    </form>
  );
}

// Gestiona la navegación post-auth y la ruta "from" (origen de la redirección).
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("login");

  // RequireAuth rellena location.state con { from: location } al redirigir.
  // Así tras el login devolvemos al usuario a donde intentó ir.
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";

  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Iniciar Sesión" }]} />
      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-tabs">
            {["login", "register"].map((tab) => (
              <button
                key={tab}
                className={`auth-tab${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "login" ? "Iniciar Sesión" : "Registrarse"}
              </button>
            ))}
          </div>
          <div className="auth-content">
            {activeTab === "login"
              ? <LoginForm onSuccess={(path) => navigate(path, { replace: true })} from={from} />
              : <RegisterForm onSuccess={(path) => navigate(path, { replace: true })} />
            }
          </div>
        </div>
      </section>
    </>
  );
}