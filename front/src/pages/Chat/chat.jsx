import './chat.css';
import { useEffect, useRef, useState } from 'react';

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
    <div>
      <header className="header">
        <div className="logo"><span>L</span>exus</div>
        <nav>
          <a href="home.html">Home</a>
          <div className="produzir-container">
            <span className="produzir-toggle">Produzir ▼</span>
            <div className="produzir-menu">
              <a href="fotografia.html">Fotografia</a>
              <a href="#">Podcast</a>
              <a href="#">Tema Proposto</a>
            </div>
          </div>
          <a href="chat.html" className="active">Chat</a>
          <a href="perfil.html">Perfil</a>
        </nav>
      </header>

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
            <button className="send-button" onClick={sendMessage}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
