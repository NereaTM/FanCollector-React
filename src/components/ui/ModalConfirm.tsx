type Props = {
  abierto: boolean;
  titulo: string;
  mensaje?: string;
  labelConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export default function ModalConfirm({ abierto, titulo, mensaje, labelConfirmar = "Confirmar", onConfirmar, onCancelar }: Props) {
  if (!abierto) return null;

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-titulo">{titulo}</h3>
        {mensaje && <p className="modal-mensaje">{mensaje}</p>}
        <div className="modal-acciones">
          <button className="btn btn-outline" onClick={onCancelar}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirmar}>{labelConfirmar}</button>
        </div>
      </div>
    </div>
  );
}