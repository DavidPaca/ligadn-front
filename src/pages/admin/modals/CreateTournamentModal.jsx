import React, { useState } from 'react';
import { X, Trophy, Layers, ChevronRight, Save } from 'lucide-react';

const CreateTournamentModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '', // 'unico' o 'categorias'
    sistema: '', // 'todos', 'mixto', 'eliminatoria'
    categorias: [] // solo si es por categorías
  });

  const handleNext = (tipo) => {
    setFormData({ ...formData, tipo });
    setStep(2);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <h2>Crear Nuevo Campeonato</h2>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="modal-body">
          {/* PASO 1: NOMBRE Y TIPO */}
          {step === 1 && (
            <div className="step-animation">
              <label className="form-label">Nombre del Campeonato</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: Copa de Verano 2026"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />

              <div className="selection-grid">
                <button 
                  className={`select-card ${formData.tipo === 'unico' ? 'active' : ''}`}
                  onClick={() => handleNext('unico')}
                >
                  <Trophy size={32} />
                  <h3>Torneo Único</h3>
                  <p>Una sola tabla de posiciones general.</p>
                  <ChevronRight size={18} className="arrow" />
                </button>

                <button 
                  className={`select-card ${formData.tipo === 'categorias' ? 'active' : ''}`}
                  onClick={() => handleNext('categorias')}
                >
                  <Layers size={32} />
                  <h3>Por Categorías</h3>
                  <p>Divide por Senior, Máster, Femenino, etc.</p>
                  <ChevronRight size={18} className="arrow" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: SISTEMA DE JUEGO */}
          {step === 2 && (
            <div className="step-animation">
              <button className="btn-back" onClick={() => setStep(1)}>← Volver</button>
              <h3 className="section-title">Selecciona el Sistema de Juego</h3>
              
              <div className="options-list">
                {[
                  { id: 'todos', label: 'Todos contra todos', desc: 'Liga regular por puntos.' },
                  { id: 'mixto', label: 'Todos contra todos + Eliminatorias', desc: 'Fase de grupos y luego Play-offs.' },
                  { id: 'eliminatoria', label: 'Eliminatoria Directa', desc: 'Llaves de muerte súbita.' }
                ].map(opt => (
                  <label key={opt.id} className="option-item">
                    <input 
                      type="radio" 
                      name="sistema" 
                      onChange={() => setFormData({...formData, sistema: opt.id})} 
                    />
                    <div className="option-info">
                      <strong>{opt.label}</strong>
                      <span>{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              <button className="btn-primary w-full mt-6">
                <Save size={18} /> Crear Campeonato
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTournamentModal;