from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.auth import verificar_senha, gerar_hash_senha, criar_token, verificar_token
from app.database import get_db
from app.models import Usuario
from app.scanner import escanear_texto

app = FastAPI(title="Sistema de Auditoria LGPD", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

class UsuarioCreate(BaseModel):
    nome: str
    email: str
    senha: str

class TextoParaEscanear(BaseModel):
    texto: str

@app.get("/")
def inicio():
    return {"mensagem": "Sistema de Auditoria LGPD funcionando"}

@app.post("/registrar")
def registrar(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    existe = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if existe:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    novo = Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha_hash=gerar_hash_senha(usuario.senha)
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return {"mensagem": "Usuário criado com sucesso", "id": novo.id}

@app.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == form.username).first()
    if not usuario or not verificar_senha(form.password, usuario.senha_hash):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    token = criar_token({"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/meu-perfil")
def meu_perfil(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verificar_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    usuario = db.query(Usuario).filter(Usuario.email == payload.get("sub")).first()
    return {"nome": usuario.nome, "email": usuario.email}

@app.post("/escanear")
def escanear(dados: TextoParaEscanear, token: str = Depends(oauth2_scheme)):
    payload = verificar_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    resultado = escanear_texto(dados.texto)
    return resultado