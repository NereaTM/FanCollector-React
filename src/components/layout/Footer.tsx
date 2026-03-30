import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../auth/AuthContext";

import emailjs from "@emailjs/browser";
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_USER = import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_USER;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Footer() {
  const { user } = useAuth();
  // Email introducido en el input del newsletter
  const [email, setEmail] = useState("");
  // Estado del proceso de suscripción
  const [estado, setEstado] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function enviarNewsletter() {
    setEstado("sending");
    try {
      // Llamada al servicio externo EmailJS
      await emailjs.send(SERVICE_ID, TEMPLATE_USER, {
        para_email: email,
        nombre: email,
        email: email,
      }, PUBLIC_KEY);
      setEstado("ok");
      setEmail("");
      setTimeout(() => setEstado("idle"), 5000);
    } catch {
      setEstado("error");
      setTimeout(() => setEstado("idle"), 4000);
    }
  }

  function handleNewsletter(e: React.SyntheticEvent<HTMLFormElement>) {
    // Evita que el formulario recargue la página y permite manejar el envío
    e.preventDefault();
    void enviarNewsletter();
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="FanCollector Logo" />
          <h3>FanCollector</h3>
          <p>Colecciona, Conecta, Comparte</p>
        </div>

        <div className="footer-links">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/colecciones">Colecciones</Link></li>
            {!user
              ? <li><Link to="/login">Iniciar Sesión</Link></li>
              : <li><Link to="/perfil">Mi Perfil</Link></li>
            }
          </ul>
        </div>

        <div>
          <h4>Síguenos</h4>
          <div className="social-icons">
            <a href="#" className="social-icon"><i className="fab fa-tiktok" /></a>
            <a href="#" className="social-icon"><i className="fab fa-instagram" /></a>
            <a href="#" className="social-icon"><i className="fab fa-twitter" /></a>
            <a href="#" className="social-icon"><i className="fab fa-youtube" /></a>
          </div>
        </div>

        <div className="footer-newsletter">
          <h4>No te pierdas nada</h4>
          {estado === "ok" && (
            <p className="newsletter-msg newsletter-msg--ok">
              <i className="fas fa-check-circle" /> ¡Suscrito! Revisa tu email.
            </p>
          )}
          {estado === "error" && (
            <p className="newsletter-msg newsletter-msg--error">
              <i className="fas fa-times-circle" /> Error al suscribirse. Inténtalo de nuevo.
            </p>
          )}
          <form onSubmit={handleNewsletter} className="newsletter-form">
            <input
              type="email"
              placeholder="Tu email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={estado === "sending"}
            />
            <button type="submit" className="btn btn-sm" disabled={estado === "sending"}>
              {estado === "sending" ? <i className="fas fa-spinner fa-spin" /> : "Suscribirse"}
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 FanCollector. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}