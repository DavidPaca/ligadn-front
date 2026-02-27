import { useState, useEffect, useCallback } from "react";
import "../../styles/carrousel.css";
const slides = [
  {
    image: "https://images.unsplash.com/photo-1522778034537-20a2486be803?q=80&w=1920&auto=format&fit=crop",
    title: "Torneo Apertura 2026",
    subtitle: "Inicio: 15 de Marzo",
  },
  {
    // image: "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?q=80&w=1920&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1920&auto=format&fit=crop",
    title: "Consulta los Horarios",
    subtitle: "Fechas y partidos actualizados",
  },
  {
    image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1920&auto=format&fit=crop",
    title: "Tabla de Posiciones",
    subtitle: "Sigue a tu equipo favorito",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 600);
    },
    [animating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <>
      <div className="carousel-wrapper">
        {slides.map((slide, i) => (
          <div key={i} className={`carousel-slide ${i === current ? "active" : ""}`}>
            <img src={slide.image} alt={slide.title} loading={i === 0 ? "eager" : "lazy"} />
            <div className="carousel-overlay" />
            <div className="carousel-text">
              <h2 className="carousel-title">{slide.title}</h2>
              <p className="carousel-subtitle">{slide.subtitle}</p>
            </div>
          </div>
        ))}

        <button className="carousel-btn left" onClick={prev} aria-label="Anterior">‹</button>
        <button className="carousel-btn right" onClick={next} aria-label="Siguiente">›</button>

        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div key={current} className="carousel-progress" />

        {/* <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div> */}
      </div>
    </>
  );
}