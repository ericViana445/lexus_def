 import React from 'react';
import './fotografia.css'; // novo CSS para esse componente
import Header from '../../components/header';
import mascoteFotografia from "../../assets/ideia.png"; // imagem temporária
import uploadFoto from '../../assets/EnviarFoto.png';   // imagem correta

const Fotografia = () => {
  return (
    <div>
      <Header />
      <div className="podcast-container">
        <div className="podcast-left">
          <h2 className="podcast-title">Fotografia</h2>
          <p className="podcast-subtitle">
            <strong>Temática:</strong> Envio de imagem
            <br />
            para interpretação
          </p>
          <img
            src={mascoteFotografia}
            alt="Mascote Fotografia"
            className="podcast-mascote"
          />
        </div>

        <div className="podcast-center">
          <input
            type="text"
            placeholder="Adicione um título ou descrição..."
            className="podcast-input"
          />
          <textarea
            placeholder="Escreva observações ou instruções sobre a imagem..."
            className="podcast-textarea"
          />
          <button className="podcast-enviar-btn">Enviar</button>
        </div>

        <div className="podcast-right">
          <div className="podcast-upload-box">
            <img
              src={uploadFoto}
              alt="Enviar Foto"
              className="podcast-upload-icon"
            />
            <p className="podcast-upload-text">Adicione a imagem aqui.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fotografia;
