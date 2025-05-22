import React from 'react';
import './podcast.css';
import Header from '../../components/header';
import mascotePodcast from "../../assets/copinho.png"; // imagem temporária
import uploadPodcast from '../../assets/EnviarPodcast.png'; // imagem correta

const Podcast = () => {
  return (
    <div>
      <Header />
      <div className="podcast-container">
        <div className="podcast-left">
          <h2 className="podcast-title">Podcast</h2>
          <p className="podcast-subtitle">
            <strong>Tematica:</strong>Podcast 
            <br />
             atualidades
          </p>
          <img
            src={mascotePodcast}
            alt="Mascote Podcast"
            className="podcast-mascote"
          />
        </div>

        <div className="podcast-center">
          <input
            type="text"
            placeholder="Adicione um tópico ou título..."
            className="podcast-input"
          />
          <textarea
            placeholder="Escreva o roteiro ou ideias para seu podcast..."
            className="podcast-textarea"
          />
          <button className="podcast-enviar-btn">Enviar</button>
        </div>

        <div className="podcast-right">
          <div className="podcast-upload-box">
            <img
              src={uploadPodcast}
              alt="Enviar Podcast"
              className="podcast-upload-icon"
            />
            <p className="podcast-upload-text">Adicione seu áudio ou roteiro aqui.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podcast;
