import { BrowserRouter, Routes, Route } from "react-router-dom";
/////////// PUBLIC ///////////
import PublicLayout from "../components/layout/publicLayout/PublicLayout";
import HomePage from "../pages/publicPages/HomePage";

/////////// ADMIN ///////////
import LoginPage from "../pages/auth/LoginPage";
import MainLayout from "../components/layout/admin/MainLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import EquiposPage from "../pages/admin/equipo/EquiposPage";
import EquiposHistoricoPage from "../pages/admin/equipo/EquipoHistoricoPage";
import VocaliaPage from "../pages/admin/vacalia/vocaliaPage";
import VocaliaHistoricoPage from "../pages/admin/vacalia/VocaliaHistorico";
import TournamentCreatePage from "../pages/admin/championship/TournamentCreatePage";
import ChampionshipPage from "../pages/admin/championship/ChampionshipPage";
import CategoryPage from "../pages/admin/categories/categoryPage";
import ChampionshipSetupPage from "../pages/admin/championship/ChampionshipSetupPage";
import PlayerPage from "../pages/admin/player/PlayerPage";
import PlayerListPage from "../pages/admin/player/PlayerListPage";

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token_liga');
    if (!token) {
        return <Navigate to="/Ingresar" replace />;
    }
    return children;
};

const AppRouter = () => {


    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="Ingresar" element={<LoginPage />} />
                </Route>

                {/* Rutas admin */}
                <Route path="/admin" element={<MainLayout />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="torneos">
                        <Route path="torneos-activos" element={<ChampionshipPage />} />
                        <Route path="torneos-activos" element={<ChampionshipPage />} />
                        <Route path="torneos-categorias/:id/setup" element={<ChampionshipSetupPage />} />
                    </Route>

                    <Route path="equipos" >
                        <Route path="lista" element={<EquiposPage />} />
                        <Route path="historico" element={<EquiposHistoricoPage />} />
                    </Route>

                    <Route path="jugadores" >
                        <Route path="nuevo-juagador" element={<PlayerPage />} />
                        <Route path="listar-jugadores" element={<PlayerListPage />} />
                    </Route>

                    <Route path="vocalias" >
                        <Route path="lista" element={<VocaliaPage />} />
                        <Route path="historico" element={<VocaliaHistoricoPage />} />
                    </Route>
                    <Route path="categorias">
                        <Route path="categorias-activas" element={<CategoryPage />} />
                        <Route path="categorias-activas" element={<CategoryPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;

