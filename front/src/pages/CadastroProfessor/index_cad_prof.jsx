import React, { useState } from 'react';
import './styles_cad_prof.css';
import iconUser from '../../assets/user.png';
import iconEmail from '../../assets/email.png';
import iconSenha from '../../assets/senha.png';
import iconConfirmar from '../../assets/confirmar.png';
import eyesComDesc from '../../assets/eyesComDesc.png';
import iconeProfessor from '../../assets/iconeProfessor.png';

const CadastroProfessor = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmar: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cadastro enviado!");
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
            <span className="destaque">Professor</span>
          </h2>
          <img src={iconeProfessor} alt="Ícone Professor" className="iconeProfessor" />
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

          <button type="submit" className="botao-final">Gerar Código</button>
        </form>
      </div>
    </div>
  );
};

export default CadastroProfessor;
