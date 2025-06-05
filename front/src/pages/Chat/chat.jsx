// src/pages/chat/Chat.jsx
import './chat.css';
import { useEffect, useRef, useState } from 'react';
import Header from '../../components/header.jsx';
import iconeEnviar from '../../assets/send.png';
import avatar from '../../assets/perfil.png';

const initialConversations = {
  George: [],
  Mônica: [],
  Charles: [],
  Paloma: [],
  Oliver: []
};

function Chat() {
  const [currentContact, setCurrentContact] = useState('George');
  const [conversations, setConversations] = useState(initialConversations);
  const [inputText, setInputText] = useState('');
  const [ws, setWs] = useState(null);
  const messagesRef = useRef(null);
  const username = 'Gabriel'; // Nome fixo neste exemplo

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/${username}`);

    socket.onopen = () => {
      console.log('WebSocket conectado');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { content, sender, system } = data;

        // Ignora mensagens do sistema e as que o próprio usuário enviou
        if (!system && sender && sender !== username) {
          setConversations(prev => {
            const updates = { ...prev };
            if (!updates[sender]) updates[sender] = [];
            updates[sender] = [...updates[sender], { sender: 'left', text: content }];
            return updates;
          });
        }
      } catch (e) {
        console.error('Erro ao processar mensagem do WebSocket:', e);
      }
    };

    socket.onerror = (err) => console.error('WebSocket erro:', err);
    socket.onclose = () => console.log('WebSocket desconectado');

    setWs(socket);
    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    // Atualiza UI localmente
    setConversations(prev => ({
      ...prev,
      [currentContact]: [...prev[currentContact], { sender: 'right', text: inputText }]
    }));

    // Envia mensagem como texto puro
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(inputText);
    }

    setInputText('');
  };

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [conversations, currentContact]);

  return (
    <div className="chat-page">
      <Header
        nome={username}
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
              style={{ backgroundColor: name === currentContact ? '#deeef2' : 'white' }}
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
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
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
