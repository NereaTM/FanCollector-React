import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Footer() {
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
            <li><Link to="/login">Iniciar Sesión</Link></li>
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
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 FanCollector. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}