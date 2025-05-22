import './ler.css';
import Header from '../../components/header';
import lerImage from '../../assets/ler.png';

function Ler() {
  return (
    <div className="app">
      <Header />

      <main className="main">
        <div className="post-card">
          <div className="post-text">
            <h2>Izabelle Dumont</h2>
            <p className="post-date">21 de Fev.</p>
            <p className="post-description">
              Mulheres correm passando por barricadas de rua em chamas no distrito de Solino, em Porto Príncipe (Haiti), enquanto moradores pedem ajuda ao governo e protestam contra a falta de segurança da cidade. A mais recente tentativa externa de ajudar o governo interino a retomar o controle — uma “missão multinacional de apoio à segurança” liderada por tropas quenianas — está subfinanciada e passando por dificuldades após uma onda de massacres de gangues que matou mais de 350 pessoas.
            </p>
          </div>
          <div className="post-image">
            <img src={lerImage} alt="Cena de protesto no Haiti" />
            <div className="debate-button-container">
              <button className="debate-button">Debater</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Ler;
