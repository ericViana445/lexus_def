 import React, { useState } from 'react';
import './styles_cad_aluno.css';
import iconUser from '../../assets/user.png';
import iconEmail from '../../assets/email.png';
import iconSenha from '../../assets/senha.png';
import iconConfirmar from '../../assets/confirmar.png';
import eyesComDesc from '../../assets/eyes1.png';
import iconeAluno from '../../assets/iconeAluno1.png';
import { useNavigate } from 'react-router-dom';

const IndexCadAluno = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmar: '',
    sala: '',
    cargo: 'aluno'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmar) {
      alert("As senhas não coincidem.");
      return;
    }

    const payload = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      sala: formData.sala,
      cargo: formData.cargo
    };

    console.log("Enviando payload:", payload);

    try {
      const response = await fetch("http://127.0.0.1:8000/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Erro no cadastro.");
      }

      const data = await response.json();
      alert(`Sucesso: ${data.mensagem}`);
      navigate('/chat'); // redireciona após o cadastro
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  return (
    <div className="contener2">
      {/* Imagem à esquerda */}
      <div className="imagem-lateral">
        <img src={eyesComDesc} alt="Imagem lateral" className="foto-lateral" />
      </div>

      {/* Formulário à direita */}
      <div className="conteudo-direito">
        <div className="cabecalho-professor">
          <h2 className="titulo">
            Bem-Vindo!<br />
            <span className="destaque">Aluno</span>
          </h2>
          <img src={iconeAluno} alt="Ícone Aluno" className="iconeProfessor" />
        </div>

        <form onSubmit={handleSubmit} className="formulario-professor">
          <div className="input-grupo">
            <img src={iconUser} alt="Ícone usuário" />
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={formData.nome}
              onChange={handleChange}
            />
          </div>

          <div className="input-grupo">
            <img src={iconEmail} alt="Ícone email" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
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
            />
          </div>

          <div className="input-grupo">
            <img src={iconConfirmar} alt="Ícone confirmar senha" />
            <input
              type="password"
              name="confirmar"
              placeholder="Confirmar Senha"
              value={formData.confirmar}
              onChange={handleChange}
            />
          </div>

          <div className="input-grupo">
            <img src={iconUser} alt="Ícone sala" />
            <input
              type="text"
              name="sala"
              placeholder="Código da Sala"
              value={formData.sala}
              onChange={handleChange}
            />
          </div>

          <button className="botao-final" type="submit">
            Entrar na Sala
          </button>
        </form>
      </div>
    </div>
  );
};

export default IndexCadAluno;
