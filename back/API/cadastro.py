import asyncio
import os
import shutil
import uuid
import sqlite3
import random
import string
from fastapi import FastAPI, HTTPException, UploadFile, Form, File, WebSocket, WebSocketDisconnect, Path, BackgroundTasks
from pydantic import BaseModel, EmailStr, field_validator
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal


app = FastAPI()

DB_FILE = "usuarios.db"

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicialização do banco
def inicializar_banco():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS salas (
                codigo TEXT PRIMARY KEY,
                email_professor TEXT UNIQUE,
                FOREIGN KEY (email_professor) REFERENCES usuarios(email)
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                cargo TEXT CHECK(cargo IN ('professor', 'aluno')) NOT NULL,
                sala TEXT,
                FOREIGN KEY (sala) REFERENCES salas(codigo)
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS publicacoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_aluno INTEGER NOT NULL,
                codigo_sala TEXT NOT NULL,
                tipo TEXT NOT NULL,
                titulo TEXT NOT NULL,
                conteudo TEXT NOT NULL,
                imagem TEXT,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_aluno) REFERENCES usuarios(id),
                FOREIGN KEY (codigo_sala) REFERENCES salas(codigo)
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mensagens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                remetente TEXT NOT NULL,
                destinatario TEXT NOT NULL,
                mensagem TEXT NOT NULL,
                lida INTEGER DEFAULT 0,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (remetente) REFERENCES usuarios(email),
                FOREIGN KEY (destinatario) REFERENCES usuarios(email)
            )
        """)

        conn.commit()

    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS salas (
                codigo TEXT PRIMARY KEY,
                email_professor TEXT UNIQUE,
                FOREIGN KEY (email_professor) REFERENCES usuarios(email)
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                cargo TEXT CHECK(cargo IN ('professor', 'aluno')) NOT NULL,
                sala TEXT,
                FOREIGN KEY (sala) REFERENCES salas(codigo)
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS publicacoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_aluno INTEGER NOT NULL,
                codigo_sala TEXT NOT NULL,
                tipo TEXT NOT NULL,
                titulo TEXT NOT NULL,
                conteudo TEXT NOT NULL,
                imagem TEXT,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_aluno) REFERENCES usuarios(id),
                FOREIGN KEY (codigo_sala) REFERENCES salas(codigo)
            )
        """)
        cursor.execute("PRAGMA table_info(publicacoes)")
        colunas = [col[1] for col in cursor.fetchall()]
        if "nota" not in colunas:
            cursor.execute("ALTER TABLE publicacoes ADD COLUMN nota REAL DEFAULT NULL")


        conn.commit()

@app.on_event("startup")
def startup_event():
    inicializar_banco()

# Modelos
class Usuario(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    cargo: Literal['professor', 'aluno']
    sala: str | None = None

    @field_validator("senha")
    def senha_minima(cls, v):
        if len(v) < 6:
            raise ValueError("A senha deve ter pelo menos 6 caracteres.")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    senha: str


class Publicacao(BaseModel):
    email_aluno: EmailStr
    codigo_sala: str
    tipo: Literal["podcast", "fotografia", "tematica"]
    titulo: str
    conteudo: str
    imagem: UploadFile = File(None)


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user_email: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_email] = websocket

    def disconnect(self, user_email: str):
        self.active_connections.pop(user_email, None)

    async def send_personal_message(self, sender_name: str, recipient_email: str, message: str):
        recipient_ws = self.active_connections.get(recipient_email)
        if recipient_ws:
            try:
                await recipient_ws.send_text(f"💬 {sender_name}: {message}")
            except Exception as e:
                print(f"Erro ao enviar mensagem: {e}")

    async def notify_sender(self, sender_email: str, message: str):
        sender_ws = self.active_connections.get(sender_email)
        if sender_ws:
            try:
                await sender_ws.send_text(f"💬 Você: {message}")
            except Exception as e:
                print(f"Erro ao notificar remetente: {e}")

manager = ConnectionManager()


# Função para gerar código de sala
def gerar_codigo_sala():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


# Rota: Cadastro de usuário
@app.post("/cadastrar")
def cadastrar_usuario(usuario: Usuario):
    try:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()

            codigo_sala = None

            if usuario.cargo == "professor":
                while True:
                    codigo_sala = gerar_codigo_sala()
                    cursor.execute("SELECT 1 FROM salas WHERE codigo = ?", (codigo_sala,))
                    if not cursor.fetchone():
                        break

                cursor.execute(
                    "INSERT INTO salas (codigo, email_professor) VALUES (?, ?)",
                    (codigo_sala, usuario.email)
                )

            elif usuario.cargo == "aluno":
                if not usuario.sala:
                    raise HTTPException(status_code=400, detail="Alunos devem informar o código da sala.")
                cursor.execute("SELECT 1 FROM salas WHERE codigo = ?", (usuario.sala,))
                if not cursor.fetchone():
                    raise HTTPException(status_code=400, detail="Código de sala inválido.")
                codigo_sala = usuario.sala

            cursor.execute(
                "INSERT INTO usuarios (nome, email, senha, cargo, sala) VALUES (?, ?, ?, ?, ?)",
                (usuario.nome, usuario.email, usuario.senha, usuario.cargo, codigo_sala)
            )

            conn.commit()

        return {
            "mensagem": "Usuário cadastrado com sucesso!",
            "codigo_sala": codigo_sala if usuario.cargo == "professor" else None
        }

    except sqlite3.IntegrityError as e:
        if "usuarios.email" in str(e):
            raise HTTPException(status_code=400, detail="Email já cadastrado.")
        elif "salas.email_professor" in str(e):
            raise HTTPException(status_code=400, detail="Este professor já criou uma sala.")
        else:
            raise HTTPException(status_code=500, detail="Erro ao cadastrar.")


# Rota: Login
@app.post("/login")
def login(usuario: LoginRequest):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT nome, senha, cargo, sala FROM usuarios WHERE email = ?",
            (usuario.email,)
        )
        resultado = cursor.fetchone()

    if resultado and resultado[1] == usuario.senha:
        return {
            "mensagem": f"Login bem-sucedido. Bem-vindo, {resultado[0]}!",
            "nome": resultado[0],  # ✅ aqui!
            "cargo": resultado[2],
            "codigo_sala": resultado[3],  # ✅ padronize o nome como está no frontend
            "email": usuario.email
        }

    raise HTTPException(status_code=401, detail="Email ou senha inválidos.")


# Rota: Criar publicação
@app.post("/publicar")
async def publicar(
    email_aluno: str = Form(...),
    codigo_sala: str = Form(...),
    tipo: Literal["podcast", "fotografia", "tematica"] = Form(...),
    titulo: str = Form(...),
    conteudo: str = Form(...),
    imagem: UploadFile = File(None)
):
    try:
        # Cria o diretório "uploads" se ele não existir
        os.makedirs("uploads", exist_ok=True)

        # Lógica para salvar imagem com nome único, se houver
        caminho_arquivo = None
        if imagem:
            nome_unico = f"{uuid.uuid4().hex}_{imagem.filename}"  # Nome único
            caminho_arquivo = f"uploads/{nome_unico}"
            with open(caminho_arquivo, "wb") as buffer:
                shutil.copyfileobj(imagem.file, buffer)

        # Log para depuração
        print(f"Procurando aluno com email: {email_aluno}")

        # Verificar se o email do aluno é válido
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM usuarios WHERE email = ?", (email_aluno,))
            aluno = cursor.fetchone()

            print(f"Resultado da busca por email: {aluno}")

            if aluno is None:
                raise HTTPException(status_code=400, detail="Aluno não encontrado com este email.")

            # Inserir a publicação no banco de dados
            cursor.execute(
                "INSERT INTO publicacoes (id_aluno, codigo_sala, tipo, titulo, conteudo, imagem) "
                "VALUES (?, ?, ?, ?, ?, ?)",
                (aluno[0], codigo_sala, tipo, titulo, conteudo, caminho_arquivo)
            )
            conn.commit()

        return {
            "mensagem": "Publicação recebida com sucesso!",
            "dados": {
                "email_aluno": email_aluno,
                "codigo_sala": codigo_sala,
                "tipo": tipo,
                "titulo": titulo,
                "conteudo": conteudo,
                "imagem": nome_unico if imagem else None
            }
        }

    except Exception as e:
        # Exibir a exceção para análise do erro
        raise HTTPException(status_code=500, detail=f"Erro ao salvar publicação: {str(e)}")

# Rota: Listar publicações de uma sala
@app.get("/publicacoes/{codigo_sala}")
def listar_publicacoes(codigo_sala: str):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT u.nome, p.tipo, p.titulo, p.conteudo, p.imagem, p.data_criacao
            FROM publicacoes p
            JOIN usuarios u ON p.id_aluno = u.id
            WHERE p.codigo_sala = ?
            ORDER BY p.data_criacao DESC
        """, (codigo_sala,))
        dados = cursor.fetchall()

    return [
        {
            "aluno": nome,
            "tipo": tipo,
            "titulo": titulo,
            "conteudo": conteudo,
            "imagem": imagem,
            "data_criacao": data
        }
        for nome, tipo, titulo, conteudo, imagem, data in dados
    ]


@app.patch("/publicacoes/{publicacao_id}/nota")
def atualizar_nota(publicacao_id: int = Path(..., description="ID da publicação"),
                   nota: float = Form(..., ge=0, le=10)):  # Exemplo: nota de 0 a 10
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM publicacoes WHERE id = ?", (publicacao_id,))
        if cursor.fetchone() is None:
            raise HTTPException(status_code=404, detail="Publicação não encontrada")

        cursor.execute("UPDATE publicacoes SET nota = ? WHERE id = ?", (nota, publicacao_id))
        conn.commit()

    return {"mensagem": "Nota atualizada com sucesso", "publicacao_id": publicacao_id, "nota": nota}




@app.get("/salas")
def listar_salas():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT s.codigo, u.nome, u.email
            FROM salas s
            JOIN usuarios u ON s.email_professor = u.email
        """)
        salas = cursor.fetchall()

    return [
        {
            "codigo": codigo,
            "professor_nome": nome,
            "professor_email": email
        }
        for codigo, nome, email in salas
    ]


def verificar_usuario_existe(email):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT nome FROM usuarios WHERE email = ?",
            (email,)
        )
        resultado = cursor.fetchone()

    if resultado:
        return resultado[0]  # Retorna o nome do usuário
    return None


#----------------------------------------CHAT----------------------------------------------


# Função: salvar a mensagem no banco de dados

def salvar_mensagem(remetente: str, destinatario: str, mensagem: str):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO mensagens (remetente, destinatario, mensagem)
            VALUES (?, ?, ?)
        """, (remetente, destinatario, mensagem))
        conn.commit()

# Função: checar novas mensagens e emitir sinais de atualização
async def verificar_novas_mensagens():
    while True:
        await asyncio.sleep(1)  # checar a cada 1 segundo
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, remetente, destinatario, mensagem FROM mensagens
                WHERE lida = 0
            """)
            mensagens = cursor.fetchall()

            for id_msg, remetente, destinatario, msg in mensagens:
                asyncio.create_task(manager.send_personal_message(remetente, destinatario, msg))
                cursor.execute("UPDATE mensagens SET lida = 1 WHERE id = ?", (id_msg,))
            conn.commit()

@app.on_event("startup")
async def startup_event():
    inicializar_banco()
    asyncio.create_task(verificar_novas_mensagens())

@app.websocket("/ws/{meu_email}")
async def websocket_chat(websocket: WebSocket, meu_email: str):
    await manager.connect(meu_email, websocket)

    try:
        while True:
            data = await websocket.receive_text()
            if ":" not in data:
                await websocket.send_text("Erro: Mensagem deve seguir o formato 'destinatario: mensagem'")
                continue

            destinatario, mensagem = map(str.strip, data.split(":", 1))

            # Salva no banco
            salvar_mensagem(meu_email, destinatario, mensagem)

            # Notifica o remetente que foi salvo
            await manager.notify_sender(meu_email, mensagem)

    except WebSocketDisconnect:
        manager.disconnect(meu_email)
    except Exception as e:
        print(f"Erro WebSocket ({meu_email}):", e)
        manager.disconnect(meu_email)
