import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import logo from "../../assets/logo.png";
 

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
 
  function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    logout();
    onClose();
    navigate("/login");
  }

  return (
    <aside
      className={`sidebar${isOpen ? " active" : ""}`}
      id="sidebar"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sidebar-header">
        <img src={logo} alt="FanCollector Logo" className="sidebar-logo" />
        <button className="close-sidebar" onClick={onClose} aria-label="Cerrar menú">
          <i className="fas fa-times" />
        </button>
      </div>
 
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul>
             <li><NavLink to="/" end><i className="fas fa-home" /> Inicio</NavLink></li>
            <li><NavLink to="/colecciones"><i className="fa-solid fa-compass" /> Catálogo</NavLink></li>
            {user && (
              <li><NavLink to="/mis-colecciones"><i className="fa-solid fa-folder-open" /> Mis Colecciones</NavLink></li>
            )}
            {user && (
              <li><NavLink to="/perfil"><i className="fas fa-user" /> Mi Perfil</NavLink></li>
            )}
            {!user && (
              <li><NavLink to="/login"><i className="fas fa-sign-in-alt" /> Iniciar Sesión</NavLink></li>
            )}
            {user && (
              <li><a href="#" onClick={handleLogout}><i className="fas fa-sign-out-alt" /> Cerrar Sesión</a></li>
            )}
          </ul>
        </nav>
      </div>
 
      {user && (
        <div className="sidebar-footer">
          <NavLink to="/colecciones/crear" className="btn btn-primary sidebar-crear-btn">
            <i className="fas fa-plus" /> Crear colección
          </NavLink>
        </div>
      )}
    </aside>
  );
}