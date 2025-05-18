"use client"

import { useState } from "react"
import "./Home.css"
// Use a relative URL reference instead of an import for Vite
// This assumes the image is in the public folder or will be properly handled by Vite

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
    <div className="lexus-container">
      {/* Header/Navigation Bar */}
      <header className="header">
        <div className="logo">
          <h1>Lexus</h1>
        </div>
        <nav className="main-nav">
          <ul>
            <li className="active">Home</li>
            <li className="dropdown">
              Produzir <span className="dropdown-arrow">▼</span>
            </li>
            <li>Chat</li>
            <li className="profile-button">Perfil</li>
          </ul>
        </nav>
      </header>

      {/* Secondary Navigation */}
      <div className="secondary-nav">
        <div className="tabs">
          <button className={activeTab === "Turmas" ? "tab active" : "tab"} onClick={() => setActiveTab("Turmas")}>
            Turmas
          </button>
          <button className={activeTab === "Mural" ? "tab active" : "tab"} onClick={() => setActiveTab("Mural")}>
            Mural
          </button>
          <button
            className={activeTab === "Produções" ? "tab active" : "tab"}
            onClick={() => setActiveTab("Produções")}
          >
            Produções
          </button>
        </div>
        <div className="user-profile">
          <div className="user-email">gabriel@email.br</div>
          <div className="user-info">
            <img
              src="/src/assets/iconeAluno.png"
              alt="Perfil do usuário"
              className="user-avatar"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "https://via.placeholder.com/40"
              }}
            />
            <div className="user-greeting">Olá, Gabriel!</div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        <div className="news-grid">
          {newsItems.map((item) => (
            <div className="news-card" key={item.id}>
              <div className="news-image">
                <img src={item.image || "/placeholder.svg"} alt="Notícia" />
              </div>
              <div className="news-content">
                <p>{item.title}</p>
                <button className="read-more-btn">Ler mais</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
