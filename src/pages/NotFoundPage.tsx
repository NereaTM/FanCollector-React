import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <h1 style={{ fontSize: "5rem", margin: "0", color: "var(--color-primary, #1D3557)" }}>404</h1>
      <h2 style={{ marginBottom: "1rem" }}>Página no encontrada</h2>
      <p style={{ marginBottom: "2rem", color: "#666" }}>
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link to="/" className="btn btn-primary">
        <i className="fas fa-home" /> Volver al inicio
      </Link>
    </div>
  );
}