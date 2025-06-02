import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './fotografia.css';
import Header from '../../components/header';
import mascoteFotografia from "../../assets/ideia.png";
import uploadFoto from '../../assets/EnviarFoto.png';

const Fotografia = () => {
  const [titulo, setTitulo] = useState('');
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
    formData.append("tipo", "fotografia");
    formData.append("titulo", titulo || "Sem título");
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
        alert("Imagem enviada com sucesso!");
        setTitulo('');
        setConteudo('');
        setImagem(null);
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
          <h2 className="podcast-title">Fotografia</h2>
          <p className="podcast-subtitle">
            <strong>Temática:</strong> Envio de imagem <br /> para interpretação
          </p>
          <img
            src={mascoteFotografia}
            alt="Mascote Fotografia"
            className="podcast-mascote"
          />
        </div>

        {/* Centro */}
        <div className="podcast-center">
          <input
            type="text"
            placeholder="Adicione um título ou descrição..."
            className="podcast-input"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            placeholder="Escreva observações ou instruções sobre a imagem..."
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
              src={uploadFoto}
              alt="Enviar Foto"
              className="podcast-upload-icon"
            />
            <p className="podcast-upload-text">Adicione a imagem aqui.</p>
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

export default Fotografia;
