import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRest from "../../../services/ApiRest";
import { Menu, Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";

function Navbar({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  //                      *******************************************************
  //**********************                      Obtencion Data                   *********************/
  //                      *******************************************************

  /////////// ONTENCION DATOS USUARIO QUE GUARDAMOS EN EL LOGIN ///////////
  const userData = JSON.parse(localStorage.getItem('user_info')) || { nombre: 'Admin', rol: 'Usuario' };

  /////////// MOSTRAR MENU EN PANTALLAS PEQUEÑAS ///////////
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  /////////// CERRAR SESIÓN ///////////
  const handleLogout = async () => {
    try {
      // 1. Avisamos a Laravel (Opcional pero recomendado para seguridad)
      await apiRest.post('/logout');
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor", error);
    } finally {
      // 2. Limpiamos TODA la data local (aunque falle el servidor, el usuario debe salir)
      localStorage.removeItem('token_liga');
      localStorage.removeItem('user_info');
      
      // 3. Redirigimos al inicio o al login público
      navigate('/Ingresar');
    }
  };

  return (
    <header className="admin-navbar">
      {/* Botón para abrir Sidebar en móvil */}
      <button className="nav-menu-btn" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      <div className="nav-user-info">
        {/* Notificaciones */}
        <button className="nav-icon-btn" style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
          <Bell size={20} />
        </button>

        {/* Contenedor del Usuario y Dropdown */}
        <div className="user-menu-container" onClick={toggleDropdown}>
          <div className="user-text">
            <span className="user-name">{userData.nombre}</span>
            <span className="user-role">{userData.rol}</span>
          </div>

          <div className="user-avatar">
            <User size={20} />
          </div>

          <ChevronDown size={16} color="#64748b" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />

          {/* Menú Desplegable */}
          <div className={`user-dropdown ${dropdownOpen ? 'show' : ''}`}>
            <div className="dropdown-item">
              <User size={16} />
              <span>Mi Perfil</span>
            </div>
            <div className="dropdown-item">
              <Settings size={16} />
              <span>Configuración</span>
            </div>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;