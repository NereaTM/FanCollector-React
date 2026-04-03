type Props = {
  imgSrc: string;
  nombre: string;
  esPlantilla: boolean;
};

export default function ColeccionDetalleImagen({ imgSrc, nombre, esPlantilla }: Props) {
  return (
    <div className="coleccion-detalle-img-wrap">
      <img src={imgSrc} alt={nombre ? `Imagen de la colección ${nombre}` : "Imagen de colección"} className="coleccion-detalle-img" />
      {esPlantilla && (
        <span className="coleccion-detalle-plantilla-badge">
          <i className="fas fa-copy" /> Plantilla
        </span>
      )}
    </div>
  );
}