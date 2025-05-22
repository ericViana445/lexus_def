 import React from 'react';
import './tema.css';
import Header from '../../components/header';
import dorminhoco from '../../assets/dorminhoco1.png';
import enviarTema from '../../assets/EnviarTema2.png';

const Tema = () => {
  return (
    <div>
      <Header />
      <div className="tema-container">
        {/* Coluna Esquerda */}
        <div className="tema-left">
          <h2 className="tema-title">Produção</h2>
          <p className="tema-subtitle">
            <strong>Temática:</strong> Tema
            <br />
            atualidades
          </p>
          <img
            src={dorminhoco}
            alt="Dorminhoco"
            className="tema-mascote"
          />
        </div>

        {/* Coluna Central */}
        <div className="tema-center">
          <input
            type="text"
            placeholder="Adicione um tema se quiser..."
            className="tema-input"
          />
          <textarea
            placeholder="Digite aqui seu texto..."
            className="tema-textarea"
          />
          {/* Botão Enviar movido para cá */}
          <button className="tema-enviar-btn">Enviar</button>
        </div>

        {/* Coluna Direita */}
        <div className="tema-right">
          <div className="tema-upload-box">
            <img
              src={enviarTema}
              alt="Enviar Tema"
              className="tema-upload-icon"
            />
            <p className="tema-upload-text">Adicione seu material de apoio aqui.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tema;
