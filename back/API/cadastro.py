import os
import shutil
import uuid
import sqlite3
import random
import string
from fastapi import FastAPI, HTTPException, UploadFile, Form, File
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

        conn.commit()

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
            "cargo": resultado[2],
            "sala": resultado[3],
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
