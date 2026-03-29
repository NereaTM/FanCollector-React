import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <aside className={`sidebar${isOpen ? " active" : ""}`} id="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">FanCollector</span>
        <button className="close-sidebar" onClick={onClose} aria-label="Cerrar menú">
          <i className="fas fa-times" />
        </button>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul>
            <li><NavLink to="/" end><i className="fas fa-home" /> Inicio</NavLink></li>
            <li><NavLink to="/colecciones"><i className="fa-solid fa-compass" /> Catálogo</NavLink></li>
            <li><NavLink to="/login"><i className="fas fa-sign-in-alt" /> Iniciar Sesión</NavLink></li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}