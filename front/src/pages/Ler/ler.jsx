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
              No distrito de Solino, em Porto Príncipe, capital do Haiti, cenas de desespero e resistência se intensificam. Mulheres correm em meio a barricadas em chamas, tentando escapar da violência que tomou conta das ruas. Pneus incendiados, gritos de socorro e tiros ao longe compõem o cenário cotidiano de uma cidade sitiada por gangues armadas, onde a população clama por ajuda e pela presença do Estado.

A insegurança na capital haitiana atingiu níveis alarmantes. Moradores de bairros como Solino organizam protestos, bloqueiam ruas e erguem barricadas improvisadas para tentar conter o avanço das facções criminosas. As manifestações, no entanto, vão além da indignação: elas são também pedidos desesperados de socorro. O governo interino, fragilizado e sem controle sobre vastas áreas urbanas, vê sua autoridade cada vez mais contestada.
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
