from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from app.auth import verificar_senha, gerar_hash_senha, criar_token, verificar_token

app = FastAPI(title="Sistema de Auditoria LGPD", version="1.0.0")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Banco de usuários temporário (depois vamos conectar ao PostgreSQL)
usuarios_db = {
    "admin": {
        "nome": "Administrador",
        "email": "admin@lgpd.com",
        "senha_hash": gerar_hash_senha("senha123")
    }
}

class Usuario(BaseModel):
    nome: str
    email: str

@app.get("/")
def inicio():
    return {"mensagem": "Sistema de Auditoria LGPD funcionando!"}

@app.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    usuario = usuarios_db.get(form.username)
    if not usuario or not verificar_senha(form.password, usuario["senha_hash"]):
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")
    token = criar_token({"sub": form.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/meu-perfil")
def meu_perfil(token: str = Depends(oauth2_scheme)):
    payload = verificar_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    usuario = usuarios_db.get(payload.get("sub"))
    return {"nome": usuario["nome"], "email": usuario["email"]}