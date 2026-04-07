import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { resolveImgUrl } from "../../utils/imagenes";
import defaultAvatar from "../../assets/iconoUser.png";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Si no hay avatar usa el icono por defecto
  const avatarSrc = resolveImgUrl(user?.urlAvatar) || defaultAvatar;
  const userName = user?.nombre ?? user?.email ?? "Usuario";

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
 
  // Efecto visual al hacer scroll
  useEffect(() => {
    function handleScroll() { setScrolled(window.scrollY > 10); }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    logout();
    setDropdownOpen(false);
    navigate("/login");
  }

  return (
    <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="navbar-left">
        <button className="toggle-sidebar" onClick={(e) => { e.stopPropagation(); onToggleSidebar(); }} aria-label="Abrir menú">
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
            {user && <li><NavLink to="/mis-colecciones">Mis Colecciones</NavLink></li>}
          </ul>
        </nav>
 
        <div className="navbar-auth">
          {!user ? (
            <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
          ) : (
            <div className="user-dropdown" ref={dropdownRef}>
              <button
                className="user-dropdown-trigger"
                onClick={(e) => { e.stopPropagation(); setDropdownOpen((v) => !v); }}
                aria-label="Menú de usuario"
              >
                <img src={avatarSrc} alt="Usuario" className="user-avatar" />
                <span>{userName}</span>
                <i className={`fas fa-chevron-${dropdownOpen ? "up" : "down"}`} style={{ marginLeft: 6, fontSize: "0.75rem" }} />
              </button>
 
              {dropdownOpen && (
                <div className="user-dropdown-menu">
                <Link
                  to={`/usuario/${user?.id}/perfil`} className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <i className="fas fa-user" /> Mi Perfil
                </Link>    
                  <a href="#" className="user-dropdown-item danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt" /> Cerrar Sesión
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}