// src/components/header/Header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './header.css';
import logoBarra from '../assets/lexus_logo_barra.png';
import avatarImg from '../assets/perfil.png'; // Imagem padrão

const Header = ({ nome, email }) => {
  const [perfilAberto, setPerfilAberto] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.stopPropagation(); // Impede que o evento se propague
    localStorage.removeItem("user");
    navigate('/login');
  };

  const togglePerfil = (e) => {
    e.stopPropagation(); // Impede que o evento se propague
    setPerfilAberto(!perfilAberto);
  };

  // Fechar dropdown ao clicar em qualquer lugar fora dele
  React.useEffect(() => {
    const closePerfil = () => setPerfilAberto(false);
    window.addEventListener('click', closePerfil);
    return () => window.removeEventListener('click', closePerfil);
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <img src={logoBarra} alt="Logo Lexus" />
      </div>
      <nav>
        <a href="/home">Home</a>
        <div className="produzir-container">
          <span className="produzir-toggle">Produzir ▼</span>
          <div className="produzir-menu">
            <a href="/foto">Fotografia</a>
            <a href="/podcast">Podcast</a>
            <a href="/tema">Tema Proposto</a>
          </div>
        </div>
        <a href="/chat">Chat</a>

        <div className="perfil-container" onClick={togglePerfil}>
          <span className="perfil-toggle">Perfil</span>
          {perfilAberto && (
            <div className="perfil-dropdown" onClick={e => e.stopPropagation()}>
              <div className="perfil-info">
                <img src={avatarImg} alt="Avatar" className="perfil-avatar" />
                <div>
                  <strong>{nome || "Usuário"}</strong>
                  <p>{email || "email@exemplo.com"}</p>
                </div>
              </div>
              <hr />
              <button 
                className="sair-botao" 
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;