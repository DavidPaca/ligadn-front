import React, { useEffect, useState } from 'react';
import {
    Trophy, Users, Calendar, PlusCircle,
    ArrowRight, Timer, CheckCircle2, AlertCircle,
    icons
} from 'lucide-react';
import '../../styles/StylesAdmin.css';
import TournamentCreatePage from './championship/TournamentCreatePage';
import CreateTournamentModal from './modals/CreateTournamentModal';
import { getEquipo } from '../../services/EquipoService';
import { getChampionship, getChampionshipAC } from '../../services/ChampionshipService';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';



const tournaments = [
    { id: 101, name: 'Copa Invierno 2026', status: 'Activo', teams: 16, category: 'Senior', date: 'Ene - Mar' },
    { id: 102, name: 'Liga Barrial Oro', status: 'Pendiente', teams: 12, category: 'Abierta', date: 'Abr - Jun' },
    { id: 103, name: 'Torneo Apertura 2025', status: 'Finalizado', teams: 20, category: 'Juvenil', date: 'Finalizado' },
];

function DashboardPage() {
    // const navigate = useNavigate(); // Inicializamos el navegador
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataListEquipos, setDataListEquipos] = useState([]); // Datos que se muestran (filtrados)
    const [dataListChampionshipAC, setDataListChampionshipAC] = useState([]);
    const [countFinalizados, setCountFinalizados] = useState(0);
    const [countPendientes, setCountPendientes] = useState(0);
    const [filteredData, setFilteredData] = useState([]); // Datos que se muestran (filtrados)
    const [isLoading, setIsLoading] = useState(true);

    /////////// LISTAR EQUIPOS ///////////
    const EquiposList = async () => {
        try {
            setIsLoading(true);

            const response = await getEquipo();
            // console.log("NUEMOR DE EQUIPOS REGISTRADOS:", response)
            setDataListEquipos(response || []);
        }
        catch {
            Swal.fire("Error", "No se pudieron cargar los equipos", "error");
        } finally {
            setIsLoading(false);
        }

    }

    ///////////  CHAMPIONSHIP LIST AC ///////////  status_championship
    const ChampionshipList = async () => {
        try {
            setIsLoading(true);
            const response = await getChampionship();

            if (response && Array.isArray(response)) {
                // Filtrar y contar por status_championship
                const finalizados = response.filter(t => t.status_championship === 'FI').length;
                const pendientes = response.filter(t => t.status_championship === 'PE').length;

                setCountFinalizados(finalizados);
                setCountPendientes(pendientes);
            }
        }
        catch {
            Swal.fire("Error", "No se pudieron cargar los torneos", "error");
        } finally {
            setIsLoading(false);
        }
    }

    ///////////  CHAMPIONSHIP LIST AC ///////////
    const ChampionshipListAC = async () => {
        try {
            setIsLoading(true);
            const response = await getChampionshipAC();
            console.log("NUEMOR DE TORNEOS AC REGISTRADOS:", response)
            setDataListChampionshipAC(response || []);
        }
        catch {
            Swal.fire("Error", "No se pudieron cargar los torneos", "error");
        } finally {
            setIsLoading(false);
        }
    }

    /////////// STATS ///////////
    const stats = [
        {
            id: 1,
            title: 'Equipos Totales',
            // Convertimos el número 3 a string para el componente
            value: dataListEquipos.length.toString(),
            icon: <Users size={22} color="#fff" />,
            colorClass: 'stat-card__icon--blue'
        },
        // { id: 2, title: 'En Curso', value: '3', icon: <Timer size={22} color="#fff" />, colorClass: 'stat-card__icon--green' },
        {
            id: 2,
            title: 'En Curso',
            value: dataListChampionshipAC.length.toString(),
            icon: <Timer size={22} color="#fff" />,
            colorClass: 'stat-card__icon--green'
        },
        // { id: 3, title: 'Finalizados', value: '12', icon: <CheckCircle2 size={22} color="#fff" />, colorClass: 'stat-card__icon--purple' },
        // { id: 4, title: 'Por Iniciar', value: '2', icon: <AlertCircle size={22} color="#fff" />, colorClass: 'stat-card__icon--orange' },
        {
            id: 3,
            title: 'Finalizados',
            value: countFinalizados.toString(), // Valor real
            icon: <CheckCircle2 size={22} color="#fff" />,
            colorClass: 'stat-card__icon--purple'
        },
        {
            id: 4,
            title: 'Por Iniciar',
            value: countPendientes.toString(), // Valor real
            icon: <AlertCircle size={22} color="#fff" />,
            colorClass: 'stat-card__icon--orange'
        },
    ];

    // useEffect(() => {
    //     EquiposList();
    // }, [])

    // useEffect(() => {
    //     ChampionshipListAC();
    // }, [])

    // useEffect(() => {
    //     ChampionshipList();
    // }, [])

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            // Ejecuta todas las peticiones al mismo tiempo
            await Promise.all([
                EquiposList(),
                ChampionshipListAC(),
                ChampionshipList()
            ]);
            setIsLoading(false);
        };
        loadDashboardData();
    }, []);



    return (
        <div className="dashboard-page">

            {/* HEADER */}
            <header className="dashboard-header">
                <div className="dashboard-header__titles">
                    <h1>Gestión de Torneos</h1>
                    <p>
                        <span className="live-dot" />
                        Control central de campeonatos — Liga Deportiva Barrial
                    </p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => {
                        console.log("Abriendo modal..."); // Para que verifiques en consola
                        setIsModalOpen(true);
                    }}
                >
                    <PlusCircle size={16} /> Crear Nuevo Torneo
                </button>
            </header>

            {/* KPI CARDS GLOBALES */}
            <div className="stats-grid">
                {stats.map((item) => (
                    <div key={item.id} className="stat-card">
                        <div className={`stat-card__icon ${item.colorClass}`}>
                            {item.icon}
                        </div>
                        <div>
                            <p className="stat-card__label">{item.title}</p>
                            {isLoading ? (
                                <div className="skeleton skeleton-value" style={{ width: '40px', height: '24px', marginTop: '5px' }}></div>
                            ) : (
                                <h3 className="stat-card__value">{item.value}</h3>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* MAIN GRID - ENFOCADO EN TORNEOS */}
            <div className="main-grid">

                {/* LISTADO DE TORNEOS RECIENTES/ACTIVOS */}
                <div className="card">
                    <div className="card__header">
                        <h2 className="card__title">Lista de Campeonatos</h2>
                        <div className="card__filters">
                            {/* Aquí podrías añadir un pequeño selector de filtros luego */}
                        </div>
                    </div>

                    <div className="tournament-list">
                        {tournaments.map((t) => (
                            <div key={t.id} className="match-row"> {/* Reutilizamos tu clase match-row por consistencia */}
                                <div className="match-row__date">
                                    <span className="match-row__date-label">TEMPORADA</span>
                                    <span className="match-row__time" style={{ fontSize: '13px' }}>{t.date}</span>
                                </div>

                                <div className="match-row__teams" style={{ justifyContent: 'flex-start', paddingLeft: '20px' }}>
                                    <div>
                                        <span className="match-row__team" style={{ display: 'block', fontSize: '16px' }}>{t.name}</span>
                                        <span style={{ fontSize: '12px', color: '#64748b' }}>{t.teams} equipos inscritos</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span className={`status-badge status-badge--${t.status.toLowerCase()}`}>
                                        {t.status}
                                    </span>
                                    <button className="btn-icon-link">
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMNA DERECHA: ACCIONES RÁPIDAS */}
                <div className="right-column">
                    <div className="live-card">
                        <h3 className="live-card__title">Acceso Rápido</h3>
                        <p className="live-card__subtitle">Configura las reglas generales para todos los torneos de este año.</p>
                        <button className="btn-live" style={{ background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}>
                            Configurar Reglamentos
                        </button>
                        <div className="live-card__deco">
                            <Trophy size={110} />
                        </div>
                    </div>

                    <div className="progress-card">
                        <h2 className="progress-card__title">Resumen de Participación</h2>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>Distribución de categorías en torneos activos.</p>
                        {/* Aquí puedes poner un gráfico simple o lista de categorías */}
                        <div className="category-item">
                            <span className="match-row__badge" style={{ marginBottom: '5px', display: 'inline-block' }}>Masculino: 60%</span>
                            <span className="match-row__badge" style={{ background: '#eff6ff', color: '#1e40af' }}>Femenino: 40%</span>
                        </div>
                    </div>
                </div>

            </div>

            {isModalOpen && (
                <CreateTournamentModal onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
}

export default DashboardPage;