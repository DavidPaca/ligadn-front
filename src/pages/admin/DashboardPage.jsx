import React, { useState } from 'react';
import {
    Trophy, Users, Calendar, PlusCircle,
    ArrowRight, Timer, CheckCircle2, AlertCircle
} from 'lucide-react';
import '../../styles/StylesAdmin.css';
import TournamentCreatePage from './championship/TournamentCreatePage';
import CreateTournamentModal from './modals/CreateTournamentModal';
import { Navigate } from 'react-router-dom';

const stats = [
    { id: 1, title: 'Equipos Totales', value: '24', icon: <Users size={22} color="#fff" />, colorClass: 'stat-card__icon--blue' },
    { id: 2, title: 'En Curso', value: '3', icon: <Timer size={22} color="#fff" />, colorClass: 'stat-card__icon--green' },
    { id: 3, title: 'Finalizados', value: '12', icon: <CheckCircle2 size={22} color="#fff" />, colorClass: 'stat-card__icon--purple' },
    { id: 4, title: 'Por Iniciar', value: '2', icon: <AlertCircle size={22} color="#fff" />, colorClass: 'stat-card__icon--orange' },
];

const tournaments = [
    { id: 101, name: 'Copa Invierno 2026', status: 'Activo', teams: 16, category: 'Senior', date: 'Ene - Mar' },
    { id: 102, name: 'Liga Barrial Oro', status: 'Pendiente', teams: 12, category: 'Abierta', date: 'Abr - Jun' },
    { id: 103, name: 'Torneo Apertura 2025', status: 'Finalizado', teams: 20, category: 'Juvenil', date: 'Finalizado' },
];

function DashboardPage() {
    // const navigate = useNavigate(); // Inicializamos el navegador
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                            <h3 className="stat-card__value">{item.value}</h3>
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