"use client"

import { useState } from "react"
import "./Home.css"
import Header from '../../components/header'; // importe o novo Header
import avatar from '../../assets/perfil.png'; // imagem do perfil

const placeholderAvatar = avatar;

const Home = () => {
  const [activeTab, setActiveTab] = useState("Turmas")

  const newsItems = [
    {
      id: 1,
      title:
        "Hugo Calderano, o mesatenista brasileiro, venceu a Copa do Mundo de tênis de mesa em Macau, na China. Ele é o primeiro atleta não asiático ou europeu a conquistar o título.",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      title:
        "Povos indígenas marcham durante o acampamento anual Terra Livre, onde discutem direitos, proteção territorial e seu papel na COP30, que acontecerá pela primeira vez na Amazônia.",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      title:
        "Mulheres correm passando por barricadas da rua em chamas no distrito de Solino, em Porto Príncipe (Haiti), enquanto moradores pedem ajuda do governo e protestam contra a falta de segurança da cidade.",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 4,
      title:
        "Cientistas protestaram nos EUA contra os cortes de pessoal e restrições à pesquisa feitos por Trump. Desde seu retorno à Casa Branca, o republicano reduziu o financiamento federal para atividades científicas.",
      image: "https://via.placeholder.com/300x200",
    },
  ]

  return (
    <div className="app-container">
      <Header 
        nome="Gabriel" 
        email="gabriel@email.br" 
        avatarImg={avatar} 
      />

      <div className="lexus-container">
        <div className="secondary-nav">
          <div className="tabs">
            <button className={activeTab === "Turmas" ? "tab active" : "tab"} onClick={() => setActiveTab("Turmas")}>Turmas</button>
            <button className={activeTab === "Mural" ? "tab active" : "tab"} onClick={() => setActiveTab("Mural")}>Mural</button>
            <button className={activeTab === "Produções" ? "tab active" : "tab"} onClick={() => setActiveTab("Produções")}>Produções</button>
          </div>
          <div className="user-profile">
            <div className="user-email">gabriel@email.br</div>
            <div className="user-info">
              <img src={placeholderAvatar} alt="Perfil do usuário" className="user-avatar" />
              <div className="user-greeting">Olá, Gabriel!</div>
            </div>
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
                      <div className="professor-avatar">
                        <img src={placeholderAvatar} alt="Professor" />
                      </div>
                    </div>
                    <div className="turma-content"></div>
                  </div>
                ))}
                <div className="add-turma-container">
                  <button className="add-turma-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <h2>Port. Instrumental - LICOMP 25</h2>
              </div>
              <div className="mural-content">
                <div className="post-input">
                  <div className="user-avatar-small">
                    <img src={placeholderAvatar} alt="Avatar" />
                  </div>
                  <input type="text" placeholder="Escreva um aviso para sua turma" className="post-text-input" />
                </div>

                <div className="post-item">
                  <div className="post-header">
                    <div className="user-avatar-small">
                      <img src={placeholderAvatar} alt="Avatar" />
                    </div>
                    <div className="post-info">
                      <div className="post-author">Luis Barone</div>
                      <div className="post-date">05 de Mai</div>
                    </div>
                  </div>
                  <div className="post-body">
                    <p>
                      Boa tarde, turma! Referente a atividade 03 de "Debate Lateral", não esqueçam da imagem oficial.
                      Boa avaliação a todos!
                    </p>
                  </div>
                </div>

                <div className="comment-input">
                  <div className="user-avatar-small">
                    <img src={placeholderAvatar} alt="Avatar" />
                  </div>
                  <div className="comment-input-container">
                    <input type="text" placeholder="Adicionar comentário para a turma..." className="comment-text-input" />
                    <button className="send-button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Produções" && (
            <div className="news-grid">
              {newsItems.map((item) => (
                <div className="news-card" key={item.id}>
                  <div className="news-image">
                    <img src={item.image} alt="Notícia" />
                  </div>
                  <div className="news-content">
                    <p>{item.title}</p>
                    <button className="read-more-btn">Ler mais</button>
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
