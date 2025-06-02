import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './podcast.css';
import Header from '../../components/header';
import mascotePodcast from "../../assets/copinho1.png";
import uploadPodcast from '../../assets/EnviarPodcast.png';

const Podcast = () => {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setArquivo(file);
  };

  const handlePublicar = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append("email_aluno", user.email);
    formData.append("codigo_sala", user.codigo_sala);
    formData.append("tipo", "podcast");
    formData.append("titulo", titulo || "Sem título");
    formData.append("conteudo", conteudo);
    if (arquivo) {
      formData.append("imagem", arquivo); // mesmo campo "imagem" no backend
    }

    try {
      const response = await fetch("http://localhost:8000/publicar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Podcast enviado com sucesso!");
        setTitulo('');
        setConteudo('');
        setArquivo(null);
        document.getElementById("upload-arquivo").value = "";
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao publicar");
      }
    } catch (error) {
      alert("Erro ao publicar: " + error.message);
    }
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div>
      <Header />
      <div className="podcast-container">
        {/* Esquerda */}
        <div className="podcast-left">
          <h2 className="podcast-title">Podcast</h2>
          <p className="podcast-subtitle">
            <strong>Temática:</strong> Podcast <br /> atualidades
          </p>
          <img
            src={mascotePodcast}
            alt="Mascote Podcast"
            className="podcast-mascote"
          />
        </div>

        {/* Centro */}
        <div className="podcast-center">
          <input
            type="text"
            placeholder="Adicione um tópico ou título..."
            className="podcast-input"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            placeholder="Escreva o roteiro ou ideias para seu podcast..."
            className="podcast-textarea"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
          />
          <button 
            className="podcast-enviar-btn"
            onClick={handlePublicar}
          >
            Enviar
          </button>
        </div>

        {/* Direita */}
        <div className="podcast-right">
          <label htmlFor="upload-arquivo" className="podcast-upload-box">
            <img
              src={uploadPodcast}
              alt="Enviar Podcast"
              className="podcast-upload-icon"
            />
            <p className="podcast-upload-text">Adicione seu áudio ou roteiro aqui.</p>
            <input
              type="file"
              id="upload-arquivo"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Podcast;
