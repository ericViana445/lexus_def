import React, { useState } from 'react';
import './styles_login.css';
import eyesComDesc from '../../assets/eyes1.png';
import iconEmail from '../../assets/email.png';
import iconSenha from '../../assets/senha.png';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // ✅ Correto: usando template string com crases
    alert(`Login realizado!\nEmail: ${formData.email}\nSenha: ${formData.senha}`);
  };

  return (
    <div className="contener2">
      {/* Imagem lateral à esquerda */}
      <div className="imagem-lateral">
        <img src={eyesComDesc} alt="Imagem lateral" className="foto-lateral" />
      </div>

      {/* Conteúdo à direita: formulário */}
      <div className="conteudo-direito">
        <div className="cabecalho-login">
          <h2 className="titulo">
            Bem-Vindo!<br />
            <span className="destaque">Login</span>
          </h2>
          
        </div>

        <form onSubmit={handleSubmit} className="formulario-login">
          <div className="input-grupo">
            <img src={iconEmail} alt="Ícone email" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-grupo">
            <img src={iconSenha} alt="Ícone senha" />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="botao-final">Entrar</button>
        </form>
      </div>
    </div>
  );
}
