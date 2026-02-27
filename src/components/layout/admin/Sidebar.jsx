import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ChevronDown, ChevronRight, History, List } from "lucide-react";

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  // Inicializamos basado en la URL para evitar el primer "salto"
  const [isEquiposOpen, setIsEquiposOpen] = useState(location.pathname.includes("equipos"));
  const [isVocaliaOpen, setIsVocaliaOpen] = useState(location.pathname.includes("vocalias"));

  // 1. Efecto para manejar la lógica de rutas y móviles
  useEffect(() => {
    const isInEquiposRoute = location.pathname.includes("equipos");

    // Usamos un pequeño delay técnico para evitar el error de "cascading renders"
    // Esto hace que el cambio sea asíncrono y React lo acepte sin quejas.
    if (!isInEquiposRoute && isEquiposOpen) {
      const timer = setTimeout(() => {
        setIsEquiposOpen(false);
        setIsVocaliaOpen(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    // 2. Lógica para móviles
    if (isOpen && window.innerWidth <= 1024) {
      toggleSidebar();
    }
  }, [location.pathname]); // Mantenemos tu estructura original de dependencias

  const isParentActive = location.pathname.includes("equipos") || isEquiposOpen;
  const isParentActivevocalia = location.pathname.includes("vocalias") || isVocaliaOpen;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span>Liga Admin</span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-title">Menú</p>

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          {/* ITEM CON SUBMENÚ EQUIPO */}
          <div className="sidebar-dropdown">
            <button
              type="button"
              className={`sidebar-link ${isParentActive ? "active" : ""}`}
              onClick={() => setIsEquiposOpen(!isEquiposOpen)}
              style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
            >
              <div className="link-content">
                <Users size={20} />
                <span>Equipos</span>
              </div>
              {isEquiposOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className={`submenu-container ${isEquiposOpen ? "expanded" : ""}`}>
              <NavLink
                to="/admin/equipos/lista"
                className={({ isActive }) => isActive ? "sidebar-sublink active" : "sidebar-sublink"}
              >
                <List size={16} />
                <span>Lista Activa</span>
              </NavLink>

              <NavLink
                to="/admin/equipos/historico"
                className={({ isActive }) => isActive ? "sidebar-sublink active" : "sidebar-sublink"}
              >
                <History size={16} />
                <span>Lista Histórica</span>
              </NavLink>
            </div>
          </div>

          {/* ITEM CON SUBMENÚ VOCALIA */}
          <div className="sidebar-dropdown">
            <button
              type="button"
              className={`sidebar-link ${isParentActivevocalia ? "active" : ""}`}
              onClick={() => setIsVocaliaOpen(!isVocaliaOpen)}
              style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
            >
              <div className="link-content">
                <Users size={20} />
                <span>Vocalia</span>
              </div>
              {isVocaliaOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className={`submenu-container ${isVocaliaOpen ? "expanded" : ""}`}>
              <NavLink
                to="/admin/vocalias/lista"
                className={({ isActive }) => isActive ? "sidebar-sublink active" : "sidebar-sublink"}
              >
                <List size={16} />
                <span>Lista Activa</span>
              </NavLink>

              <NavLink
                to="/admin/vocalias/historico"
                className={({ isActive }) => isActive ? "sidebar-sublink active" : "sidebar-sublink"}
              >
                <History size={16} />
                <span>Lista Histórica</span>
              </NavLink>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;