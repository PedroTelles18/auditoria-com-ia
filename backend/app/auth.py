from datetime import datetime, timedelta
from jose import JWTError, jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# Configurações
SECRET_KEY = "sua-chave-secreta-lgpd-2026"
ALGORITHM = "HS256"
TEMPO_EXPIRACAO = 30  # minutos

ph = PasswordHasher()

def verificar_senha(senha_plana, senha_hash):
    try:
        return ph.verify(senha_hash, senha_plana)
    except VerifyMismatchError:
        return False

def gerar_hash_senha(senha):
    return ph.hash(senha)

def criar_token(dados: dict):
    dados_copia = dados.copy()
    expiracao = datetime.utcnow() + timedelta(minutes=TEMPO_EXPIRACAO)
    dados_copia.update({"exp": expiracao})
    token = jwt.encode(dados_copia, SECRET_KEY, algorithm=ALGORITHM)
    return token

def verificar_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None