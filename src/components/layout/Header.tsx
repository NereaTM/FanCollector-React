import { Link, NavLink } from "react-router-dom";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="toggle-sidebar" onClick={onToggleSidebar} aria-label="Abrir menú">
          <i className="fas fa-bars" />
        </button>
        <Link to="/" className="navbar-brand">
          <span className="navbar-title">FanCollector</span>
        </Link>
      </div>

      <div className="navbar-right">
        <nav className="navbar-nav">
          <ul>
            <li><NavLink to="/" end>Inicio</NavLink></li>
            <li><NavLink to="/colecciones">Catálogo</NavLink></li>
          </ul>
        </nav>

        <div className="navbar-auth">
          <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
        </div>
      </div>
    </header>
  );
}