"use client"
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import "./Home.css"
import Header from '../../components/header'
import avatar from '../../assets/avatar.png'
import bannerMural from '../../assets/banner_mural.png'
import sendIcon from '../../assets/send.png'

const placeholderAvatar = avatar

const Home = () => {
  const [activeTab, setActiveTab] = useState("Turmas")
  const [newsItems, setNewsItems] = useState([])
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

useEffect(() => {
    // Verificar se há usuário logado
    const userData = JSON.parse(localStorage.getItem("user"))
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(userData)
  }, [navigate]) // ← Adicione navigate aqui


  
  useEffect(() => {
    if (!user?.codigo_sala) return
    
    const fetchPublicacoes = async () => {
      try {
        const response = await fetch(`http://localhost:8000/publicacoes/${user.codigo_sala}`);
        const data = await response.json();
        setNewsItems(data);
      } catch (error) {
        console.error("Erro ao buscar produções:", error);
      }
    };

    if (activeTab === "Produções") {
      fetchPublicacoes();
    }
  }, [activeTab, user?.codigo_sala]);

  if (!user) {
    return <div>Carregando...</div> // Ou um spinner de loading
  }





  return (
    <div className="app-container">
      <Header 
        nome={user.nome || "Usuário"}  
        email={user.email || "email@teste.com"} 
        avatarImg={avatar} 
      />

      <div className="lexus-container">
        <div className="secondary-nav">
          <div className="tabs">
            <button className={activeTab === "Turmas" ? "tab active" : "tab"} onClick={() => setActiveTab("Turmas")}>Turmas</button>
            <button className={activeTab === "Mural" ? "tab active" : "tab"} onClick={() => setActiveTab("Mural")}>Mural</button>
            <button className={activeTab === "Produções" ? "tab active" : "tab"} onClick={() => setActiveTab("Produções")}>Produções</button>
          </div>
        </div>

        <div className="content-section">
          {activeTab === "Turmas" && (
            <div className="turmas-container">
              <div className="turmas-grid">
                {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                  <div className="turma-card" key={item}>
                    <div className="turma-header">
                      <div className="turma-title">Port. Instrumental - LICOMP...</div>
                      <div className="turma-professor">Prof. Luis Barone</div>
                      <div className="turma-codigo">Código da Turma: 00000</div>
                      <div className="professor-avatar">
                        <img src={placeholderAvatar} alt="Professor" />
                      </div>
                    </div>
                    <div className="turma-content"></div>
                  </div>
                ))}

                <div className="add-turma-container">
                  <button className="add-turma-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <div className="add-turma-text">Adicionar Turma</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Mural" && (
            <div className="mural-container">
              <div className="mural-header">
                <span>Port. Instrumental - LICOMP 25</span>
                <img 
                  src={bannerMural} 
                  alt="Ilustração do mural" 
                  className="mural-illustration" 
                />
              </div>

              <div className="mural-content">
                <div className="post-item">
                  <div className="user-avatar-small">
                    <img src={placeholderAvatar} alt="Avatar" />
                  </div>
                  <div className="post-content comment-input-container">
                    <input type="text" placeholder="Escreva um aviso para sua turma" className="post-text-input" />
                    <button className="send-button">
                      <img src={sendIcon} alt="Enviar" style={{ width: "42px", height: "44px" }} />
                    </button>
                  </div>
                </div>

                <div className="post-item">
                  <div className="user-avatar-small">
                    <img src={placeholderAvatar} alt="Avatar" />
                  </div>
                  <div className="post-content">
                    <div className="post-info">
                      <div className="post-author">Luis Barone</div>
                      <div className="post-datee">05 de Maio</div>
                    </div>
                    <div className="post-body">
                      <p>
                        Boa tarde, turma! Referente a atividade 03 de “Debate Lateral”, não esqueçam da imagem oficial. Boa avaliação a todos!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="post-item">
                  <div className="user-avatar-small">
                    <img src={placeholderAvatar} alt="Avatar" />
                  </div>
                  <div className="post-content comment-input-container">
                    <input type="text" placeholder="Adicionar comentário para a turma..." className="comment-text-input" />
                    <button className="send-button">
                      <img src={sendIcon} alt="Enviar" style={{ width: "44px", height: "44px" }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Produções" && (
            <div className="news-grid">
              {newsItems.map((item, index) => (
                <div className="news-card" key={index}>
                  <div className="news-image">
                    {item.imagem ? (
                      <img src={`http://localhost:8000/${item.imagem}`} alt="Produção" />
                    ) : (
                      <img src={placeholderAvatar} alt="Sem imagem" />
                    )}
                  </div>
                  <div className="news-content">
                    <p><strong>{item.titulo}</strong></p>
                    <p>{item.conteudo}</p>
                    <p><em>Tipo: {item.tipo}</em></p>
                    <p><small>Por: {item.aluno} em {new Date(item.data_criacao).toLocaleDateString()}</small></p>
                    <Link to="/lermais" className="read-more-btn">Ler mais</Link>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
