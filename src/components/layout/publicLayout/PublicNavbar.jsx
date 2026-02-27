import { Link } from "react-router-dom";

function PublicNavbar() {
  return (
    <nav style={{ background: "#0f172a", padding: "15px" }}>
      <Link to="/" style={{ color: "#fff", marginRight: "15px" }}>Inicio</Link>
      <Link to="/quienes-somos" style={{ color: "#fff", marginRight: "15px" }}>Quiénes Somos</Link>
      <Link to="/vision-mision" style={{ color: "#fff", marginRight: "15px" }}>Visión y Misión</Link>
      <Link to="/equipo" style={{ color: "#fff", marginRight: "15px" }}>Equipo</Link>
      <Link to="/contacto" style={{ color: "#fff", marginRight: "15px" }}>Contacto</Link>
      <Link to="/Ingresar" style={{ color: "#fff" }}>Ingresar</Link>
    </nav>
  );
}

export default PublicNavbar;
