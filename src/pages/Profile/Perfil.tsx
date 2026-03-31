import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioById } from "../../data/usuariosApi";
import { useAuth } from "../../auth/AuthContext";
import { resolveImgUrl } from "../../utils/imagenes";
import PerfilVista from "../../components/domain/PerfilVista";
import defaultAvatar from "../../assets/iconoUser.png";
import type { AuthUser } from "../../types/auth";

export default function PerfilPropio() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    if (!user?.id) return;
    getUsuarioById(user.id)
      .then((u) => setUsuario(u as AuthUser))
      .catch((err: Error) => setError(err?.message || "Error al cargar el perfil"))
      .finally(() => setLoading(false));
  }, [user?.id]);
  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando perfil...</p>;
  if (error || !usuario) return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <p>{error ?? "No se pudo cargar el perfil."}</p>
      <button className="btn btn-outline" onClick={() => window.location.reload()}>
        Reintentar
      </button>
    </div>
  );

  return (
    <PerfilVista
      nombre={usuario.nombre}
      rol={usuario.rol}
      fechaRegistro={usuario.fechaRegistro}
      avatarSrc={resolveImgUrl(usuario.urlAvatar) || defaultAvatar}
      email={usuario.email}
      descripcion={usuario.descripcion}
      contactoPublico={usuario.contactoPublico}
      esPropio
      editarUrl="/perfil/editar"
      cambiarPasswordUrl="/perfil/cambiar-password"
      onCerrarSesion={() => { logout(); navigate("/login"); }}
    />
  );
}