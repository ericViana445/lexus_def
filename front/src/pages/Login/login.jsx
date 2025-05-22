import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Importa o hook de navegação
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

  const navigate = useNavigate(); // 👈 Hook de navegação

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.senha) {
      alert('Por favor, preencha todos os campos.');
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
          nome: "temporário" // 👈 Necessário porque a API espera também "nome"
        })
      });

      const resultado = await response.json();

      if (response.ok) {
        alert(resultado.mensagem);
        navigate('/home'); // 👈 Redireciona para /home
      } else {
        alert(`Erro: ${resultado.detail}`);
      }

    } catch (err) {
      alert("Erro ao conectar com o servidor.");
      console.error(err);
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
