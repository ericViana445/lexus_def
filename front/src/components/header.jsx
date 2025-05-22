import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoBarra from '../assets/lexus_logo_barra.png';
import avatar from '../assets/perfil.png';
import './header.css'; // ideal separar o css do header em outro arquivo

function Header() {
  const [perfilAberto, setPerfilAberto] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logoBarra} alt="Logo Lexus" />
        </Link>
      </div>
      <nav>
        <Link to="/home">Home</Link>

        <div className="produzir-container">
          <span className="produzir-toggle">Produzir ▼</span>
          <div className="produzir-menu">
            <Link to="/fotografia">Fotografia</Link>
            <Link to="/podcast">Podcast</Link>
            <Link to="/tema">Tema Proposto</Link>
          </div>
        </div>

        <Link to="/chat">Chat</Link>

        <div className="perfil-container" onClick={() => setPerfilAberto(!perfilAberto)}>
          <span className="perfil-toggle">Perfil</span>
          {perfilAberto && (
            <div className="perfil-dropdown">
              <div className="perfil-info">
                <img src={avatar} alt="Avatar" className="perfil-avatar" />
                <div>
                  <strong>Seu Nome</strong>
                  <p>seu@email.com</p>
                </div>
              </div>
              <hr />
              <button className="sair-botao">Sair</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
