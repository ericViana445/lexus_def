from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, field_validator
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal
import sqlite3
import random
import string

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
        conn.commit()

inicializar_banco()

# Modelo de dados do usuário
class Usuario(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    cargo: Literal['professor', 'aluno']
    sala: str | None = None  # Aluno precisa informar a sala


    @field_validator("senha")
    def senha_minima(cls, v):
        if len(v) < 6:
            raise ValueError("A senha deve ter pelo menos 6 caracteres.")
        return v

# Função para gerar código de sala
def gerar_codigo_sala():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# Cadastro de usuário
@app.post("/cadastrar")
def cadastrar_usuario(usuario: Usuario):
    try:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()

            codigo_sala = None

            # Se for professor, criar uma sala e atribuir
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

            cursor.execute(
                "INSERT INTO usuarios (nome, email, senha, cargo, sala) VALUES (?, ?, ?, ?, ?)",
                (usuario.nome, usuario.email, usuario.senha, usuario.cargo, codigo_sala)
            )

            conn.commit()
            print(f"cadastrado com sucesso{Usuario}")

        return {
            "mensagem": "Usuário cadastrado com sucesso!",
            "codigo_sala": codigo_sala if usuario.cargo == "professor" else None
        }

    except sqlite3.IntegrityError as e:
        if "usuarios.email" in str(e):
            raise HTTPException(status_code=400, detail="Email já cadastrado.")
            print("erro no cadastro")

        elif "salas.email_professor" in str(e):
            raise HTTPException(status_code=400, detail="Este professor já criou uma sala.")
            print("erro no cadastro")
        else:
            raise HTTPException(status_code=500, detail="Erro ao cadastrar.")
            print("erro no cadastro")


# Listar usuários
@app.get("/usuarios")
def listar_usuarios():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT nome, email, cargo, sala FROM usuarios")
        usuarios = cursor.fetchall()

    return [{"nome": u[0], "email": u[1], "cargo": u[2], "sala": u[3]} for u in usuarios]

# Modelo para login
class LoginRequest(BaseModel):
    nome: str
    email: EmailStr
    senha: str

# Rota de login
@app.post("/login")
def login(usuario: LoginRequest):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT nome, senha, cargo, sala FROM usuarios WHERE email = ?",
            (usuario.email,)
        )
        resultado = cursor.fetchone()

    if resultado and resultado[0] == usuario.nome and resultado[1] == usuario.senha:
        return {
            "mensagem": f"Login bem-sucedido. Bem-vindo, {usuario.nome}!",
            "cargo": resultado[2],
            "sala": resultado[3]
        }

    raise HTTPException(status_code=401, detail="Email ou senha inválidos.")
