import React, { useState } from 'react';
import './styles_cad_aluno.css';
import cadastroImage from '../../assets/eyes.png'; // Ajuste o caminho conforme a sua estrutura de pastas

const CadastroAluno = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmar: '',
    codigo_turma: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nome, email, senha } = formData;

    try {
      const response = await fetch("http://127.0.0.1:8000/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, cargo: "aluno" })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensagem);
      } else {
        alert(data.detail);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao cadastrar.");
    }

    window.location.href = '/';
  };

  return (
    <div className="container">
      <div className="left">
        <h2>Aluno</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="confirmar">Confirmar Senha</label>
            <input type="password" id="confirmar" name="confirmar" value={formData.confirmar} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="codigo_turma">Código da Turma</label>
            <input type="text" id="codigo_turma" name="codigo_turma" value={formData.codigo_turma} onChange={handleChange} />
          </div>
          <button type="submit" className="submit-btn">Cadastrar</button>
        </form>
      </div>
      <div className="right">
        <img src={cadastroImage} alt="Cadastro Aluno" />
        <div className="caption">JR, Williamsburg<br /><small>JR 2012</small></div>
      </div>
    </div>
  );
};

export default CadastroAluno;
