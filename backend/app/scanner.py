import re

# Padrões de dados pessoais da LGPD
PADROES = {
    "CPF": {
        "regex": r'\d{3}[\.\s]?\d{3}[\.\s]?\d{3}[-\.\s]?\d{2}',
        "categoria": "Dado Pessoal Sensível",
        "risco": "crítico"
    },
    "EMAIL": {
        "regex": r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
        "categoria": "Dado Pessoal",
        "risco": "médio"
    },
    "TELEFONE": {
        "regex": r'(\(?\d{2}\)?\s?)(\d{4,5}[-\s]?\d{4})',
        "categoria": "Dado Pessoal",
        "risco": "médio"
    },
    "CEP": {
        "regex": r'\d{5}-?\d{3}',
        "categoria": "Dado Pessoal",
        "risco": "baixo"
    },
    "CARTAO_CREDITO": {
        "regex": r'\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}',
        "categoria": "Dado Financeiro Sensível",
        "risco": "crítico"
    },
    "RG": {
        "regex": r'\d{1,2}[\.\s]?\d{3}[\.\s]?\d{3}[-\.\s]?\d{1}',
        "categoria": "Dado Pessoal Sensível",
        "risco": "crítico"
    }
}

def calcular_score(resultados):
    score = 100
    for item in resultados:
        if item["risco"] == "crítico":
            score -= 20
        elif item["risco"] == "médio":
            score -= 10
        elif item["risco"] == "baixo":
            score -= 5
    return max(0, score)

def escanear_texto(texto: str):
    encontrados = []
    for tipo, config in PADROES.items():
        matches = re.findall(config["regex"], texto)
        if matches:
            encontrados.append({
                "tipo": tipo,
                "categoria": config["categoria"],
                "risco": config["risco"],
                "quantidade": len(matches),
                "exemplos": matches[:2]  # mostra só 2 exemplos
            })
    
    score = calcular_score(encontrados)
    
    return {
        "score_conformidade": score,
        "total_ocorrencias": sum(i["quantidade"] for i in encontrados),
        "dados_encontrados": encontrados
    }