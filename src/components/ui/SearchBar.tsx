import { useState } from "react";

type TipoBusqueda = "nombre" | "categoria" | "nombreCreador";
const TIPOS: TipoBusqueda[] = ["nombre", "categoria", "nombreCreador"]; 

type SearchParams = {
  query: string;
  tipoBusqueda: TipoBusqueda;
  soloPlantillas: boolean;
};

type Props = {
  onSearch: (params: SearchParams) => void;
};

const placeholders: Record<TipoBusqueda, string> = {
  nombre: "Buscar por nombre...",
  categoria: "Buscar por categoría...",
  nombreCreador: "Buscar por creador...",
};

const labels: Record<TipoBusqueda, string> = {
  nombre: "Nombre",
  categoria: "Categoría",
  nombreCreador: "Creador",
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");
  const [tipoBusqueda, setTipoBusqueda] = useState<TipoBusqueda>("nombre");
  const [soloPlantillas, setSoloPlantillas] = useState(false);

  function lanzarBusqueda(overrides?: Partial<SearchParams>) {
    onSearch({
      query: query.trim(),
      tipoBusqueda,
      soloPlantillas,
      ...overrides,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    lanzarBusqueda();
  }

  function handleTipoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nuevoTipo = e.target.value as TipoBusqueda;
    setTipoBusqueda(nuevoTipo);

    if (query.trim()) {
      lanzarBusqueda({ tipoBusqueda: nuevoTipo });
    }
  }

  function handlePlantillaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setSoloPlantillas(checked);
    lanzarBusqueda({ soloPlantillas: checked });
  }

  return (
    <div className="search-bar">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-group">
          <input
            type="text"
            id="search-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholders[tipoBusqueda]}
            autoComplete="off"
          />
          <button type="submit" className="search-submit">
            <i className="fas fa-search" /> Buscar
          </button>
        </div>

        <div className="search-filters">
          {TIPOS.map((tipo) => (
            <label className="filter-option" key={tipo}>
              <input
                type="radio"
                name="tipoBusqueda"
                value={tipo}
                checked={tipoBusqueda === tipo}
                onChange={handleTipoChange}
              />
              <span>{labels[tipo]}</span>
            </label>
          ))}

          <label className="filter-option filter-option--toggle">
            <input type="checkbox" checked={soloPlantillas} onChange={handlePlantillaChange} />
            <span>
              <i className="fas fa-layer-group" /> Solo plantillas
            </span>
          </label>
        </div>
      </form>
    </div>
  );
}