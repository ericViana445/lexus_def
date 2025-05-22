import './styles_cad.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo_lexus from '../../assets/logo_lexus.png';
import iconeAluno from '../../assets/iconeAluno2.png';
import iconeProfessor from '../../assets/iconeProfessor.png';
import eyesComDesc from '../../assets/eyes1.png';

function OpcaoCadastro() {
  const navigate = useNavigate();
  const [tipoUsuario, setTipoUsuario] = useState(null);

  const selecionarTipo = (tipo) => {
    setTipoUsuario(tipo);
  };

  const handleCadastro = () => {
    if (tipoUsuario === 'aluno') {
      navigate('/cadastro-aluno');
    } else if (tipoUsuario === 'professor') {
      navigate('/cadastro-professor');
    } else {
      alert('Por favor, selecione uma opção antes de continuar.');
    }
  };

  return (
    <div className='contener2'>
      {/* Imagem à esquerda */}
      <div className="imagem-lateral">
        <img src={eyesComDesc} alt="Imagem lateral" className="foto-lateral" />
      </div>

      {/* Conteúdo à direita */}
      <div className="conteudo-direito">
        <div className='logo_lexus'>
          <img src={logo_lexus} alt="logo" className="foto2" />
        </div>

        <div className='frase'>
          Bem vindo! Cadastre-se como...
        </div>

        <button
          className={`botao professor ${tipoUsuario === 'professor' ? 'selecionado' : ''}`}
          onClick={() => selecionarTipo('professor')}
        >
          Professor
          <img src={iconeProfessor} alt="icone" className="icone_prof" />
        </button>

        <button
          className={`botao aluno ${tipoUsuario === 'aluno' ? 'selecionado' : ''}`}
          onClick={() => selecionarTipo('aluno')}
        >
          Aluno
          <img src={iconeAluno} alt="icone" className="icone_aluno" />
        </button>

        <button className="botao-final" onClick={handleCadastro}>
          Cadastrar
        </button>
      </div>
    </div>
  );
}

export default OpcaoCadastro;
