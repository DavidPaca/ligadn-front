import React, { useState } from 'react';
import { Modal, Input, Radio, Button } from 'antd';
import { X, Trophy, Layers, ChevronRight, Save, ArrowLeft } from 'lucide-react';

const CreateTournamentModal = ({ isVisible, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '', // 'unico' o 'categorias'
    sistema: '', 
    categorias: []
  });

  const handleNext = (tipo) => {
    setFormData({ ...formData, tipo });
    setStep(2);
  };

  const handleBack = () => setStep(1);

  return (
    <Modal
      title={null} // Personalizamos el header nosotros
      open={isVisible}
      onCancel={onClose}
      footer={null} // Quitamos los botones por defecto de Antd para usar los tuyos
      centered
      width={650}
      closable={false} // Usaremos tu propio botón de cerrar
      bodyStyle={{ padding: 0 }} // Para controlar el diseño interno
    >
      <div className="antd-custom-modal">
        {/* HEADER PERSONALIZADO */}
        <header className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Crear Nuevo Campeonato</h2>
          <button 
            className="btn-close" 
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </header>

        <div className="modal-body" style={{ padding: '24px' }}>
          {/* PASO 1: NOMBRE Y TIPO */}
          {step === 1 && (
            <div className="step-animation">
              <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Nombre del Campeonato
              </label>
              <Input 
                size="large"
                placeholder="Ej: Copa de Verano 2026"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                style={{ marginBottom: '24px' }}
              />

              <div className="selection-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div 
                  className={`select-card ${formData.tipo === 'unico' ? 'active' : ''}`}
                  onClick={() => handleNext('unico')}
                  style={{ cursor: 'pointer' }}
                >
                  <Trophy size={32} />
                  <h3>Torneo Único</h3>
                  <p>Una sola tabla de posiciones general.</p>
                  <ChevronRight size={18} className="arrow" />
                </div>

                <div 
                  className={`select-card ${formData.tipo === 'categorias' ? 'active' : ''}`}
                  onClick={() => handleNext('categorias')}
                  style={{ cursor: 'pointer' }}
                >
                  <Layers size={32} />
                  <h3>Por Categorías</h3>
                  <p>Divide por Senior, Máster, Femenino, etc.</p>
                  <ChevronRight size={18} className="arrow" />
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: SISTEMA DE JUEGO */}
          {step === 2 && (
            <div className="step-animation">
              <Button 
                type="text" 
                icon={<ArrowLeft size={16} />} 
                onClick={handleBack}
                style={{ marginBottom: '16px', padding: 0 }}
              >
                Volver
              </Button>
              
              <h3 className="section-title" style={{ marginBottom: '20px' }}>Selecciona el Sistema de Juego</h3>
              
              <Radio.Group 
                className="options-list" 
                style={{ width: '100%' }}
                onChange={(e) => setFormData({...formData, sistema: e.target.value})}
                value={formData.sistema}
              >
                {[
                  { id: 'todos', label: 'Todos contra todos', desc: 'Liga regular por puntos.' },
                  { id: 'mixto', label: 'Todos contra todos + Eliminatorias', desc: 'Fase de grupos y luego Play-offs.' },
                  { id: 'eliminatoria', label: 'Eliminatoria Directa', desc: 'Llaves de muerte súbita.' }
                ].map(opt => (
                  <label key={opt.id} className="option-item" style={{ display: 'flex', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer' }}>
                    <Radio value={opt.id} />
                    <div className="option-info" style={{ marginLeft: '12px' }}>
                      <strong style={{ display: 'block' }}>{opt.label}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </Radio.Group>

              <Button 
                type="primary" 
                size="large" 
                block 
                icon={<Save size={18} />}
                style={{ marginTop: '24px', height: '45px', backgroundColor: '#10b981', borderColor: '#10b981' }}
              >
                Crear Campeonato
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateTournamentModal;