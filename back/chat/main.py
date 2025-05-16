from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, Text, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
import datetime
from typing import Dict, Optional
from pydantic import BaseModel  # Importação adicionada

app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Banco de Dados
SQLALCHEMY_DATABASE_URL = "sqlite:///./chat.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo Pydantic para mensagens (adicionado)
class MessageModel(BaseModel):
    content: str
    username: str

# Modelos SQLAlchemy
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    messages = relationship("Message", back_populates="user")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    timestamp = Column(String, default=lambda: datetime.datetime.now().isoformat())
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="messages")

# Criar tabelas
Base.metadata.create_all(bind=engine)

# Dependência para obter sessão DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Gerenciador de conexões WebSocket
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, username: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[username] = websocket
        await self.broadcast(f"{username} entrou no chat", system=True)

    def disconnect(self, username: str):
        if username in self.active_connections:
            del self.active_connections[username]
            return True
        return False

    async def broadcast(self, message: str, system: bool = False, sender: Optional[str] = None):
        message_data = {
            "content": message,
            "timestamp": datetime.datetime.now().isoformat(),
            "system": system,
            "sender": sender
        }
        
        disconnected = []
        for username, connection in self.active_connections.items():
            try:
                await connection.send_json(message_data)
            except:
                disconnected.append(username)
        
        for username in disconnected:
            self.disconnect(username)

manager = ConnectionManager()

# Rota WebSocket
@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str, db: Session = Depends(get_db)):
    # Verificar se usuário já existe ou criar novo
    user = db.query(User).filter(User.username == username).first()
    if not user:
        user = User(username=username)
        db.add(user)
        db.commit()
        db.refresh(user)

    await manager.connect(username, websocket)

    try:
        while True:
            data = await websocket.receive_text()
            
            # Criar e salvar mensagem
            message = Message(content=data, user_id=user.id)
            db.add(message)
            db.commit()
            
            # Broadcast para todos
            await manager.broadcast(data, sender=username)

    except WebSocketDisconnect:
        manager.disconnect(username)
        await manager.broadcast(f"{username} saiu do chat", system=True)
    except Exception as e:
        print(f"Erro: {e}")
        manager.disconnect(username)

# Rotas HTTP para histórico
@app.get("/messages/")
def get_messages(db: Session = Depends(get_db)):
    messages = db.query(Message).order_by(Message.timestamp).all()
    return [
        {
            "content": msg.content,
            "timestamp": msg.timestamp,
            "username": msg.user.username
        }
        for msg in messages
    ]

@app.get("/messages/{username}")
def get_user_messages(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return []
        
    messages = db.query(Message).filter(Message.user_id == user.id).order_by(Message.timestamp).all()
    return [
        {
            "content": msg.content,
            "timestamp": msg.timestamp
        }
        for msg in messages
    ]