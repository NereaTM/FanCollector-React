import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'

import "./styles/tokens.css"
import "./styles/base.css"
import "./styles/layout.css"
import "./styles/home.css"
import "./styles/forms.css"
import "./styles/componentes.css"
import "./styles/perfil.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);