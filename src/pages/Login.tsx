import { useState } from "react";
import PasswordInput from "../components/ui/PasswordInput";


function LoginForm() {
  // Estado del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    console.log("Login:", { email, password });
  }

 return (
    <form id="login" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Contraseña</label>
        <PasswordInput
          id="login-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block">
        Iniciar Sesión
      </button>
    </form>
  );
}

function RegisterForm() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  // ...formulario copia los campos actuales, solo pisa el que cambió
  setFormulario((formulario) => ({ ...formulario, [e.target.name]: e.target.value }));

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    console.log("Regist:", formulario);
  }

  return (
    <form id="register" onSubmit={handleSubmit}>
      {(["nombre", "apellido"] as const).map((name) => (
        <div className="form-group" key={name}>
          <label htmlFor={`register-${name}`}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </label>
          <input
            type="text"
            id={`register-${name}`}
            name={name}
            value={formulario[name]}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      <div className="form-group">
        <label htmlFor="register-email">Email</label>
        <input
          type="email"
          id="register-email"
          name="email"
          value={formulario.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-password">Contraseña</label>
        <PasswordInput
          id="register-password"
          name="password"
          value={formulario.password}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-confirm-password">Confirmar Contraseña</label>
        <PasswordInput
          id="register-confirm-password"
          name="confirmPassword"
          value={formulario.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block">
        Registrarse
      </button>
    </form>
  );
}

export default function Login() {
  const [pestañaActiva, setPestañaActiva] = useState("login");

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-tabs">
          {["login", "register"].map((tab) => (
            <button
              key={tab}
              className={`auth-tab${pestañaActiva === tab ? " active" : ""}`}
              onClick={() => setPestañaActiva(tab)}
            >
              {tab === "login" ? "Iniciar Sesión" : "Registrarse"}
            </button>
          ))}
        </div>

        <div className="auth-content">
          <div className={`auth-form${pestañaActiva === "login" ? " active" : ""}`}>
            <LoginForm />
          </div>

          <div className={`auth-form${pestañaActiva === "register" ? " active" : ""}`}>
            <RegisterForm />
          </div>
        </div>
      </div>
    </section>
  );
}