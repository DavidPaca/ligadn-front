import React, { useState } from 'react';
import { X, Trophy, Layers, ChevronRight, Save } from 'lucide-react';

const TournamentCreatePage = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nombre: '',
        tipo: '',
        sistema: '',
        categorias: []
    });

    const handleNext = (tipo) => {
        if (!formData.nombre.trim()) return; // no avanzar sin nombre
        setFormData({ ...formData, tipo });
        setStep(2);
    };

    const canAdvance = formData.nombre.trim().length > 0;

    const sistemas = [
        { id: 'todos',        label: 'Todos contra todos',              desc: 'Liga regular, clasificación por puntos.' },
        { id: 'mixto',        label: 'Todos contra todos + Eliminatorias', desc: 'Fase de grupos y luego Play-offs.' },
        { id: 'eliminatoria', label: 'Eliminatoria Directa',            desc: 'Llaves de muerte súbita.' },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                {/* ── HEADER ── */}
                <header className="modal-header">
                    <h2>Crear Nuevo Campeonato</h2>
                    <button className="btn-close" onClick={onClose} aria-label="Cerrar">
                        <X size={18} />
                    </button>
                </header>

                {/* ── STEPPER ── */}
                <div className="stepper">
                    <div className="stepper__step">
                        <div className={`stepper__circle ${step >= 1 ? 'stepper__circle--active' : 'stepper__circle--pending'}`}>
                            1
                        </div>
                        <span className={`stepper__label ${step === 1 ? 'stepper__label--active' : ''}`}>
                            Tipo
                        </span>
                    </div>
                    <div className={`stepper__line ${step >= 2 ? 'stepper__line--done' : ''}`} />
                    <div className="stepper__step">
                        <div className={`stepper__circle ${step === 2 ? 'stepper__circle--active' : 'stepper__circle--pending'}`}>
                            2
                        </div>
                        <span className={`stepper__label ${step === 2 ? 'stepper__label--active' : ''}`}>
                            Sistema
                        </span>
                    </div>
                </div>

                {/* ── BODY ── */}
                <div className="modal-body">

                    {/* PASO 1 */}
                    {step === 1 && (
                        <div className="step-animation">
                            <label className="form-label">Nombre del Campeonato</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej: Copa de Verano 2026"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                autoFocus
                            />

                            {!canAdvance && (
                                <p style={{ fontSize: '12px', color: '#f59e0b', marginTop: '6px' }}>
                                    ✦ Escribe un nombre para continuar
                                </p>
                            )}

                            <div className="selection-grid">
                                <button
                                    className={`select-card ${formData.tipo === 'unico' ? 'active' : ''} ${!canAdvance ? 'disabled-card' : ''}`}
                                    onClick={() => handleNext('unico')}
                                    disabled={!canAdvance}
                                    style={{ opacity: canAdvance ? 1 : 0.45, cursor: canAdvance ? 'pointer' : 'not-allowed' }}
                                >
                                    <div className="select-card__icon select-card__icon--trophy">
                                        <Trophy size={24} color="#fff" />
                                    </div>
                                    <h3>Torneo Único</h3>
                                    <p>Una sola tabla de posiciones general.</p>
                                    <ChevronRight size={18} className="arrow" />
                                </button>

                                <button
                                    className={`select-card ${formData.tipo === 'categorias' ? 'active' : ''}`}
                                    onClick={() => handleNext('categorias')}
                                    disabled={!canAdvance}
                                    style={{ opacity: canAdvance ? 1 : 0.45, cursor: canAdvance ? 'pointer' : 'not-allowed' }}
                                >
                                    <div className="select-card__icon select-card__icon--layers">
                                        <Layers size={24} color="#fff" />
                                    </div>
                                    <h3>Por Categorías</h3>
                                    <p>Divide por Senior, Máster, Femenino, etc.</p>
                                    <ChevronRight size={18} className="arrow" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PASO 2 */}
                    {step === 2 && (
                        <div className="step-animation">
                            <button className="btn-back" onClick={() => setStep(1)}>
                                ← Volver
                            </button>

                            <h3 className="section-title">Sistema de Juego</h3>

                            <div className="options-list">
                                {sistemas.map(opt => (
                                    <label key={opt.id} className="option-item">
                                        <input
                                            type="radio"
                                            name="sistema"
                                            checked={formData.sistema === opt.id}
                                            onChange={() => setFormData({ ...formData, sistema: opt.id })}
                                        />
                                        <div className="option-info">
                                            <strong>{opt.label}</strong>
                                            <span>{opt.desc}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <button
                                className="btn-primary w-full mt-6"
                                disabled={!formData.sistema}
                            >
                                <Save size={16} /> Crear Campeonato
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default TournamentCreatePage;