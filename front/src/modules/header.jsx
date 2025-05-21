import './header.css'


return(
    <header className="header">
      <div className="logo">
        <img src={logoBarra} alt="Logo Lexus" />
      </div>
      <nav>
        <a href="#">Home</a>
        <div className="produzir-container">
          <span className="produzir-toggle">Produzir ▼</span>
          <div className="produzir-menu">
            <a href="#">Fotografia</a>
            <a href="#">Podcast</a>
            <a href="#">Tema Proposto</a>
          </div>
        </div>
        <a href="#" className="active">Chat</a>
        {/* ✅ Dropdown ativado por "Perfil" */}
        <div className="perfil-container" onClick={() => setPerfilAberto(!perfilAberto)}>
          <span className="perfil-toggle">Perfil</span>
          {perfilAberto && (
            <div className="perfil-dropdown">
              <div className="perfil-info">
                <img src={avatar} alt="Avatar" className="perfil-avatar" />
                <div>
                  <strong>Seu Nome</strong>
                  <p>seu@email.com</p>
                </div>
              </div>
              <hr />
              <button className="sair-botao">Sair</button>
            </div>
          )}
        </div>
      </nav>
    </header>
)