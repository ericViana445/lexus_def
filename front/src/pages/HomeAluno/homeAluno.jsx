"use client"

import { useState } from "react"
import "./homeAluno.css"
import Header from '../../components/header'
import avatar from '../../assets/avatar.png'
import bannerMural from '../../assets/banner_mural.png'
import sendIcon from '../../assets/send.png'

import prod1 from "../../assets/exempo_de_producao1.jpg"
import prod2 from "../../assets/exempo_de_producao2.jpg"
import prod3 from "../../assets/exempo_de_producao3.jpg"
import prod4 from "../../assets/exempo_de_producao4.jpg"
import prod5 from "../../assets/exempo_de_producao5.jpg"

const placeholderAvatar = avatar

const HomeAluno = () => {
  const [activeTab, setActiveTab] = useState("Mural")

  const newsItems = [
    { id: 1, title: "Hugo Calderano venceu a Copa do Mundo em Macau.", image: prod1 },
    { id: 2, title: "Povos indígenas marcham pela proteção territorial.", image: prod2 },
    { id: 3, title: "Moradores de Porto Príncipe pedem mais segurança.", image: prod3 },
    { id: 4, title: "Protestos nos EUA contra cortes na ciência.", image: prod4 },
    { id: 5, title: "Danos estruturais em Chernobyl após ataques.", image: prod5 },
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
            {/* Turmas removido aqui */}
            <button className={activeTab === "Mural" ? "tab active" : "tab"} onClick={() => setActiveTab("Mural")}>Mural</button>
            <button className={activeTab === "Produções" ? "tab active" : "tab"} onClick={() => setActiveTab("Produções")}>Produções</button>
          </div>
        </div>

        <div className="content-section">
          {activeTab === "Mural" && (
            <div className="mural-container">
              <div className="mural-header">
                <span>Port. Instrumental - LICOMP 25</span>
                <img src={bannerMural} alt="Ilustração do mural" className="mural-illustration" />
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
                      <div className="post-date">05 de Mai</div>
                    </div>
                    <div className="post-body">
                      <p>
                        Boa tarde, turma! Referente à atividade 03 de “Debate Lateral”, não esqueçam da imagem oficial. Boa avaliação a todos!
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

export default HomeAluno
