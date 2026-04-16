import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ChevronDown, ChevronRight, History, List, Trophy, UserCog } from "lucide-react";

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  
  // Inicializamos basado en la URL para que el submenú correspondiente aparezca abierto al cargar
  const [isEquiposOpen, setIsEquiposOpen] = useState(location.pathname.includes("equipos"));
  const [isVocaliaOpen, setIsVocaliaOpen] = useState(location.pathname.includes("vocalias"));
  const [isChampionshipOpen, setIsChampionshipOpen] = useState(location.pathname.includes("championship"));
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(location.pathname.includes("categorias"));
  const [isPlayersOpen, setIsPlayersOpen] = useState(location.pathname.includes("jugadores"));

  useEffect(() => {
    const isInEquiposRoute = location.pathname.includes("equipos");
    const isInVocaliaRoute = location.pathname.includes("vocalias");
    const isInChampionshipRoute = location.pathname.includes("championship");
    const isInCategoriesRoute = location.pathname.includes("categorias");

    // Si salimos de una ruta, cerramos su submenú (Lógica asíncrona para evitar errores de renderizado)
    const timer = setTimeout(() => {
      if (!isInEquiposRoute) setIsEquiposOpen(false);
      if (!isInVocaliaRoute) setIsVocaliaOpen(false);
      if (!isInChampionshipRoute) setIsChampionshipOpen(false);
      if (!isInCategoriesRoute) setIsCategoriesOpen(false);
    }, 0);

    // Lógica para móviles: cerrar sidebar al navegar
    if (isOpen && window.innerWidth <= 1024) {
      toggleSidebar();
    }

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Estados de "Padre Activo" para iluminar el botón principal si una subruta está activa
  const isParentActiveEquipos = location.pathname.includes("equipos") || isEquiposOpen;
  const isParentActiveVocalia = location.pathname.includes("vocalias") || isVocaliaOpen;
  const isParentActiveChampionship = location.pathname.includes("championship") || isChampionshipOpen;
  const isParentActiveCategories = location.pathname.includes("categorias") || isCategoriesOpen;
  const isParentActivePlayers = location.pathname.includes("jugadores") || isPlayersOpen;

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

          {/* ITEM CON SUBMENÚ TORNEOS - CORREGIDO */}
          <div className="sidebar-dropdown">
            <button
              type="button"
              className={`sidebar-link ${isParentActiveChampionship ? "active" : ""}`}
              onClick={() => setIsChampionshipOpen(!isChampionshipOpen)} // Cambia su propio estado
              style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
            >
              <div className="link-content">
                <Trophy size={20} /> {/* Cambiado a Trophy para diferenciar de Equipos */}
                <span>Torneos</span>
              </div>
              {isChampionshipOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className={`submenu-container ${isChampionshipOpen ? "expanded" : ""}`}>
              <NavLink
                to="/admin/torneos/torneos-activos" // Ruta corregida
                className={({ isActive }) => isActive ? "sidebar-sublink active" : "sidebar-sublink"}
              >
                <List size={16} />
                <span>Torneos Activos</span>
              </NavLink>

              <NavLink
                to="/admin/torneos/torneos-activos" // Ruta corregida
                className={({ isActive }) => isActive ? "sidebar-sublink active" : "sidebar-sublink"}
              >
                <History size={16} />
                <span>Torneos Históricos</span>
              </NavLink>
            </div>
          </div>

          {/* ITEM CON SUBMENÚ EQUIPO */}
          <div className="sidebar-dropdown">
            <button
              type="button"
              className={`sidebar-link ${isParentActiveEquipos ? "active" : ""}`}
              onClick={() => setIsEquiposOpen(!isEquiposOpen)} // Cambia su propio estado
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

          {/* ITEM CON SUBMENÚ JUGADORES */}
          <div className="sidebar-dropdown">
            <button
              type="button"
              className={`sidebar-link ${isParentActivePlayers ? "active" : ""}`}
              onClick={() => setIsPlayersOpen(!isPlayersOpen)}
              style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
            >
              <div className="link-content">
                <Users size={20} />
                <span>Jugadores</span>
              </div>
              {isPlayersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className={`submenu-container ${isPlayersOpen ? "expanded" : ""}`}>
              <NavLink
                to="/admin/jugadores/nuevo-juagador"
                className={({ isActive }) => isActive ? "sidebar-sublink active" : "sidebar-sublink"}
              >
                <List size={16} />
                <span>Nuevo Jugador</span>
              </NavLink>

              <NavLink
                to="/admin/jugadores/listar-jugadores"
                className={({ isActive }) => isActive ? "sidebar-sublink active" : "sidebar-sublink"}
              >
                <History size={16} />
                <span>Listar Jugadores</span>
              </NavLink>
            </div>
          </div>


          {/* ITEM CON SUBMENÚ VOCALIA */}
          <div className="sidebar-dropdown">
            <button
              type="button"
              className={`sidebar-link ${isParentActiveVocalia ? "active" : ""}`}
              onClick={() => setIsVocaliaOpen(!isVocaliaOpen)}
              style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
            >
              <div className="link-content">
                <UserCog size={20} /> {/* Icono cambiado para consistencia visual */}
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

          {/* ITEM CON SUBMENÚ CATEGORIAS */}
          <div className="sidebar-dropdown">
            <button
              type="button"
              className={`sidebar-link ${isParentActiveCategories ? "active" : ""}`}
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
            >
              <div className="link-content">
                <List size={20} />
                <span>Categorias</span>
              </div>
              {isCategoriesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className={`submenu-container ${isCategoriesOpen ? "expanded" : ""}`}>
              <NavLink
                to="/admin/categorias/categorias-activas"
                className={({ isActive }) => isActive ? "sidebar-sublink active" : "sidebar-sublink"}
              >
                <List size={16} />
                <span>Lista Activa</span>
              </NavLink>

              <NavLink
                to="/admin/categorias/categorias-activas"
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