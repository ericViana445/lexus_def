import './styles.css';
import { useState } from 'react';
import lexus from '../../assets/lexus.png';
import eyes from '../../assets/eyes.png';
import descricao_imagem from '../../assets/descricao_imagem.png';
import { Link } from 'react-router-dom';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <div className="letreiro">
        {/* Lado esquerdo - Texto */}
        <div className="texto">
          <h1 className="titulo">CONECTE-SE AO PROJETO</h1>
          <img src={lexus} alt="Imagem Lexus" className="logo" />

          <h1 className="subtitulo">
            Vá além dos aspectos normativos da linguagem, produza textos e compartilhe com a turma!
          </h1>
          <p className="slogan">
            Expresse sua criatividade e questione o mundo.
          </p>

          <div className="botoes">
            <Link to="/cadastro" className="botao cadastrar">Cadastrar-se</Link>
            <Link to="#" className="botao logar">Logar</Link>
          </div>
        </div>

        {/* Lado direito - Imagens */}
        <div className="imagem-bloco">
          <div className="imagem">
            <img src={eyes} alt="ilustração" className="foto" />
          </div>

          <div className="descricao-imagem">
            <img src={descricao_imagem} alt="descrição" className="foto-descricao" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;