// src/pages/login/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles_login.css';
import eyesComDesc from '../../assets/eyes1.png';
import iconEmail from '../../assets/email.png';
import iconSenha from '../../assets/senha.png';
import descricao_imagem from '../../assets/descricao_imagem.png';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário já está autenticado
    const user = localStorage.getItem("user");
    if (user) {
      navigate('/home');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Limpa mensagens de erro ao digitar
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!formData.email || !formData.senha) {
      setErrorMessage('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.senha,
          nome: "temporário"
        })
      });

      const resultado = await response.json();

      if (response.ok) {
        // Armazena apenas informações necessárias
        localStorage.setItem("user", JSON.stringify({
          nome: resultado.nome,
          email: formData.email,
          codigo_sala: resultado.codigo_sala
        }));
        
        navigate('/home');
      } else {
        setErrorMessage(`Erro: ${resultado.detail || 'Credenciais inválidas'}`);
      }

    } catch (err) {
      setErrorMessage("Erro ao conectar com o servidor.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contener2">
      <div className="imagem-bloco">
        <div className="imagem">
          <img src={eyesComDesc} alt="ilustração" className="foto" />
        </div>
        <div className="descricao-imagem">
          <img src={descricao_imagem} alt="descrição" className="foto-descricao" />
        </div>
      </div>

      <div className="conteudo-direito">
        <div className="cabecalho-login">
          <h2 className="titulo">
            Bem-Vindo!<br />
            <span className="destaque">Login</span>
          </h2>
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="botao-final"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}