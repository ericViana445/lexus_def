import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles_cad_prof.css';
import iconUser from '../../assets/user.png';
import iconEmail from '../../assets/email.png';
import iconSenha from '../../assets/senha.png';
import iconConfirmar from '../../assets/confirmar.png';
import eyesComDesc from '../../assets/eyes1.png';
import iconeProfessor from '../../assets/iconeProfessor.png';

const CadastroProfessor = () => {
  const navigate = useNavigate(); // ✅ inicializa o hook de navegação

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',  
    confirmar: '',
    cargo: 'professor'
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
      cargo: formData.cargo
    };

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
      alert(`✅ Sucesso: ${data.mensagem}\nCódigo da Sala: ${data.codigo_sala || "N/A"}`);

      // ✅ Redireciona após sucesso
      navigate('/home');

    } catch (err) {
      alert(`❌ Erro: ${err.message}`);
    }
  };

  return (
    <div className="contener2">
      <div className="imagem-lateral">
        <img src={eyesComDesc} alt="Imagem lateral" className="foto-lateral" />
      </div>

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
              required
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

          <div className="input-grupo">
            <img src={iconConfirmar} alt="Ícone confirmar senha" />
            <input
              type="password"
              name="confirmar"
              placeholder="Confirmar Senha"
              value={formData.confirmar}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="botao-final">
            Cadastrar e Gerar Sala
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroProfessor;
