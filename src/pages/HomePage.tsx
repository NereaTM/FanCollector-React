import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import headerImg from "../assets/headerColecciones.png";
import exploraImg  from "../assets/explora.png";
import creaImg from "../assets/creaygestiona.jpg";
import comparteImg from "../assets/comparte.png";
import crearCta from "../assets/CrearCuenta.png";

const FAQ_ITEMS = [
  {
    titulo: "¿Qué es FanCollector?",
    texto: "Es una plataforma para gestionar, organizar y compartir tus colecciones de forma sencilla.",
    img: exploraImg,
    alt: "Qué es FanCollector"
  },
  {
    titulo: "¿Necesito registrarme?",
    texto: "Sí, necesitas una cuenta para crear y guardar tus colecciones.",
    img: crearCta,
    alt: "Registro en la plataforma"
  },
  {
    titulo: "¿Puedo compartir mis colecciones?",
    texto: "Sí, puedes hacerlas públicas para que otros usuarios las vean o las usen como plantilla.",
    img: comparteImg,
    alt: "Compartir colecciones"
  },
  {
  titulo: "¿Tengo que crear todo desde cero o hay algo predefinido?",
  texto: "No necesitas empezar desde cero. Puedes explorar y reutilizar plantillas creadas por la comunidad para ahorrar tiempo y adaptarlas a tus propias colecciones.",
  img: creaImg,
  alt: "Uso de plantillas de la comunidad"
  }
];

function Accordion() {
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <div className="accordion">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className={`accordion-item${abierto === i ? " active" : ""}`}>
          <div className="accordion-header" onClick={() => setAbierto(abierto === i ? null : i)}>
            <h3>{item.titulo}</h3>
            <i className={`fas fa-${abierto === i ? "minus" : "plus"}`} />
          </div>
          {abierto === i && (
            <div className="accordion-content">
              <p>{item.texto}</p>
              <img src={item.img} alt={item.alt} className="accordion-image" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ContactForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }
    return (
    <div className="contact-form">
      <form onSubmit={handleSubmit} id="contact-form">
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input type="text" id="name" name="name" required className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="message">Mensaje</label>
          <textarea id="message" name="message" rows={5} required className="form-textarea" />
        </div>
        <button type="submit" className="btn btn-primary">
          Enviar Mensaje
        </button>
      </form>
    </div>
  );
}
export default function HomePage() {
  return (
    <>
      <section className="hero" style={{ backgroundImage: `linear-gradient(rgba(10, 35, 66, 0.7), rgba(10, 35, 66, 0.7)), url(${headerImg})` }}>
        <div className="hero-content">
          <h1>FanCollector</h1>
          <p>Gestiona y comparte tus colecciones.</p>
          <Link className="btn btn-primary" to="/colecciones">Explorar</Link>
        </div>
      </section>

      <section className="section bg-light">
        <div className="section-header">
          <h2>¿Tienes dudas?</h2>
          <p>Aquí las preguntas más comunes</p>
        </div>
        <Accordion />
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>¿Listo para comenzar?</h2>
          <p>Regístrate ahora y comienza a registrar tu progreso</p>
          <Link to="/login" className="btn btn-primary btn-lg">Crear Cuenta</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Contacto</h2>
          <p>¿Tienes alguna pregunta o sugerencia? Escríbenos</p>
        </div>
        <ContactForm />
      </section>
    </>
  );
}