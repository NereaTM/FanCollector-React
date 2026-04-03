import { Link } from "react-router-dom";

type Props = {
  editarUrl: string;
  añadirItemUrl?: string;
  onBorrar: () => void;
};

export default function PanelAdmin({ editarUrl, añadirItemUrl, onBorrar }: Props) {
  return (
    <div className="coleccion-detalle-acciones-main">
      {añadirItemUrl && (
        <Link to={añadirItemUrl} className="btn btn-success">
          <i className="fas fa-plus" /> Añadir item
        </Link>
      )}
      <Link to={editarUrl} className="btn btn-warning">
        <i className="fas fa-edit" /> Editar
      </Link>
      <button type="button" className="btn btn-danger" onClick={onBorrar}>
        <i className="fas fa-trash" /> Eliminar
      </button>
    </div>
  );
}