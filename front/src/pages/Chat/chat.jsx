import './chat.css';
import { useEffect, useRef, useState } from 'react';
import Header from '../../components/header.jsx';
import iconeEnviar from '../../assets/send.png';
import avatar from '../../assets/perfil.png';



const initialConversations = {
  George: [
    { sender: "right", text: "Olá! Envie sua produção aqui." },
    { sender: "right", text: "Você pode mandar áudio, texto ou imagem." },
    { sender: "left", text: "Tudo bem, estou escrevendo agora." },
    { sender: "left", text: "Vai ser sobre meio ambiente!" }
  ],
  Mônica: [],
  Charles: [],
  Paloma: [],
  Oliver: []
};

function Chat() {
  const [currentContact, setCurrentContact] = useState("George");
  const [conversations, setConversations] = useState(initialConversations);
  const [inputText, setInputText] = useState("");
  const [perfilAberto, setPerfilAberto] = useState(false);
  const messagesRef = useRef(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    setConversations(prev => ({
      ...prev,
      [currentContact]: [...prev[currentContact], { sender: "right", text: inputText }]
    }));
    setInputText("");
  };

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [conversations, currentContact]);

  return (
    <div className="chat-page">
      <Header 
        nome="Gabriel" 
        email="gabriel@email.br" 
        avatarImg={avatar} 
      />
      <div className="chat-container">
        <div className="contacts">
          {Object.keys(conversations).map(name => (
            <div
              key={name}
              className="contact"
              onClick={() => setCurrentContact(name)}
              style={{
                backgroundColor: name === currentContact ? "#deeef2" : "white"
              }}
            >
              {name}
              <span className="badge">{conversations[name].length}</span>
            </div>
          ))}
        </div>

        <div className="chat-box">
          <div className="messages" ref={messagesRef}>
            {(conversations[currentContact] || []).map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="send-button" onClick={sendMessage}>
              <img src={iconeEnviar} alt="Enviar" className="icone-enviar" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
