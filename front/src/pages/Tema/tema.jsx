import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './tema.css';
import Header from '../../components/header';
import dorminhoco from '../../assets/dorminhoco1.png';
import enviarTema from '../../assets/EnviarTema2.png';

const Tema = () => {
  const [tema, setTema] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [imagem, setImagem] = useState(null);
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
    if (file) setImagem(file);
  };

  const handlePublicar = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append("email_aluno", user.email);
    formData.append("codigo_sala", user.codigo_sala);
    formData.append("tipo", "tematica");
    formData.append("titulo", tema || "Sem título");
    formData.append("conteudo", conteudo);
    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      const response = await fetch("http://localhost:8000/publicar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Publicado com sucesso!");
        setTema('');
        setConteudo('');
        setImagem(null);
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
            value={tema}
            onChange={(e) => setTema(e.target.value)}
          />
          <textarea
            placeholder="Digite aqui seu texto..."
            className="tema-textarea"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
          />
          <button 
            className="tema-enviar-btn"
            onClick={handlePublicar}
          >
            Enviar
          </button>
        </div>

        {/* Coluna Direita */}
        <div className="tema-right">
          <label htmlFor="upload-arquivo" className="tema-upload-box">
            <img
              src={enviarTema}
              alt="Enviar Tema"
              className="tema-upload-icon"
            />
            <p className="tema-upload-text">Adicione seu material de apoio aqui.</p>
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

export default Tema;
