'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [perfil, setPerfil] = useState<any>(null)
  const [texto, setTexto] = useState('')
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [aba, setAba] = useState('dashboard')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/'); return }
    fetch('http://localhost:8000/meu-perfil', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setPerfil).catch(() => router.push('/'))
  }, [])

  async function escanear() {
    setLoading(true)
    setResultado(null)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:8000/escanear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ texto })
      })
      if (res.status === 401) { router.push('/'); return }
      const data = await res.json()
      if (data.score_conformidade !== undefined) setResultado(data)
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    router.push('/')
  }

  const scoreColor = resultado
    ? resultado.score_conformidade >= 70 ? '#00ff88'
      : resultado.score_conformidade >= 40 ? '#ffaa00' : '#ff4444'
    : '#00ff88'

  const riscoColor = (risco: string) =>
    risco === 'crítico' ? '#ff4444' : risco === 'médio' ? '#ffaa00' : '#00ff88'

  const dadosEncontrados = resultado?.dados_encontrados || []

  return (
    <main className="min-h-screen bg-[#060910]" style={{fontFamily: "'DM Sans', sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div className="fixed inset-0 opacity-[0.02]" style={{backgroundImage: 'linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)', backgroundSize: '50px 50px'}} />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 border-r flex flex-col" style={{background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)'}}>
        <div className="p-6 border-b" style={{borderColor: 'rgba(255,255,255,0.06)'}}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #00ff88, #00cc6a)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#060910" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="text-white font-semibold" style={{fontFamily: "'Space Mono', monospace"}}>LGPD<span style={{color: '#00ff88'}}>audit</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'scanner', label: 'Scanner LGPD', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
            { id: 'configuracoes', label: 'Configurações', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
          ].map(item => (
            <button key={item.id} onClick={() => setAba(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left"
              style={{
                background: aba === item.id ? 'rgba(0,255,136,0.1)' : 'transparent',
                color: aba === item.id ? '#00ff88' : '#6b7280',
                border: aba === item.id ? '1px solid rgba(0,255,136,0.2)' : '1px solid transparent'
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={item.icon}/>
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t" style={{borderColor: 'rgba(255,255,255,0.06)'}}>
          {perfil && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#060910'}}>
                {perfil.nome?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white text-xs font-medium">{perfil.nome}</p>
                <p className="text-gray-600 text-xs">{perfil.email}</p>
              </div>
            </div>
          )}
          <button onClick={logout} className="w-full py-2 rounded-lg text-xs transition-all" style={{color: '#6b7280', border: '1px solid rgba(255,255,255,0.06)'}}>
            Sair do sistema
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8 relative">

        {aba === 'dashboard' && (
          <div>
            <h1 className="text-white text-2xl font-semibold mb-1">Dashboard</h1>
            <p className="text-gray-500 text-sm mb-8">Visão geral do status de conformidade LGPD</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Score Médio', valor: '—', sub: 'Nenhum scan realizado', cor: '#00ff88' },
                { label: 'Scans Realizados', valor: '0', sub: 'Hoje', cor: '#00aaff' },
                { label: 'Riscos Críticos', valor: '0', sub: 'Pendentes', cor: '#ff4444' },
              ].map((card, i) => (
                <div key={i} className="rounded-2xl p-6 border" style={{background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)'}}>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">{card.label}</p>
                  <p className="text-3xl font-semibold mb-1" style={{color: card.cor, fontFamily: "'Space Mono', monospace"}}>{card.valor}</p>
                  <p className="text-gray-600 text-xs">{card.sub}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-8 border flex flex-col items-center justify-center text-center" style={{background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)', minHeight: '300px'}}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)'}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="1.5">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <p className="text-white font-medium mb-2">Nenhum scan realizado ainda</p>
              <p className="text-gray-500 text-sm mb-6">Vá para o Scanner LGPD para analisar seus dados</p>
              <button onClick={() => setAba('scanner')} className="px-6 py-2.5 rounded-xl text-sm font-medium" style={{background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#060910'}}>
                Iniciar Scanner
              </button>
            </div>
          </div>
        )}

        {aba === 'scanner' && (
          <div>
            <h1 className="text-white text-2xl font-semibold mb-1">Scanner LGPD</h1>
            <p className="text-gray-500 text-sm mb-8">Analise textos e identifique dados pessoais automaticamente</p>
            <div className="rounded-2xl p-6 border mb-6" style={{background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)'}}>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-3 block">Texto para análise</label>
              <textarea
                value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder="Cole aqui o texto que deseja analisar..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none text-sm resize-none"
                style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
              />
              <button onClick={escanear} disabled={loading || !texto}
                className="mt-4 px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{background: !texto ? 'rgba(0,255,136,0.2)' : 'linear-gradient(135deg, #00ff88, #00cc6a)', color: !texto ? '#4b5563' : '#060910'}}>
                {loading ? 'Analisando...' : 'Escanear texto'}
              </button>
            </div>

            {resultado && (
              <div className="rounded-2xl p-6 border" style={{background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)'}}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Score de Conformidade</p>
                    <p className="text-5xl font-bold" style={{color: scoreColor, fontFamily: "'Space Mono', monospace"}}>{resultado.score_conformidade}<span className="text-2xl">/100</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total de Ocorrências</p>
                    <p className="text-3xl font-bold text-white" style={{fontFamily: "'Space Mono', monospace"}}>{resultado.total_ocorrencias}</p>
                  </div>
                </div>
                {dadosEncontrados.length === 0 ? (
                  <p className="text-center py-4" style={{color: '#00ff88'}}>✓ Nenhum dado pessoal encontrado!</p>
                ) : (
                  <div className="space-y-3">
                    {dadosEncontrados.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{background: riscoColor(item.risco)}} />
                          <div>
                            <p className="text-white text-sm font-medium">{item.tipo}</p>
                            <p className="text-gray-500 text-xs">{item.categoria}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{background: `${riscoColor(item.risco)}20`, color: riscoColor(item.risco)}}>
                            {item.risco}
                          </span>
                          <p className="text-gray-500 text-xs mt-1">{item.quantidade} ocorrência(s)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {aba === 'configuracoes' && (
          <div>
            <h1 className="text-white text-2xl font-semibold mb-1">Configurações</h1>
            <p className="text-gray-500 text-sm mb-8">Configure o agente de escaneamento e preferências</p>
            <div className="space-y-6">
              <div className="rounded-2xl p-6 border" style={{background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)'}}>
                <h2 className="text-white font-medium mb-4">Agente de Escaneamento</h2>
                <div className="space-y-4">
                  {[
                    { label: 'URL do Banco de Dados', placeholder: 'postgresql://usuario:senha@host:5432/banco', type: 'text' },
                    { label: 'Intervalo de Scan (horas)', placeholder: '24', type: 'number' },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">{field.label}</label>
                      <input type={field.type} placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none text-sm"
                        style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}/>
                    </div>
                  ))}
                  <button className="px-6 py-2.5 rounded-xl text-sm font-medium" style={{background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#060910'}}>
                    Salvar configurações
                  </button>
                </div>
              </div>
              <div className="rounded-2xl p-6 border" style={{background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)'}}>
                <h2 className="text-white font-medium mb-4">Tipos de Dados Monitorados</h2>
                <div className="space-y-3">
                  {['CPF', 'Email', 'Telefone', 'CEP', 'Cartão de Crédito', 'RG'].map((tipo, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{background: 'rgba(255,255,255,0.03)'}}>
                      <span className="text-gray-300 text-sm">{tipo}</span>
                      <div className="w-10 h-5 rounded-full flex items-center px-0.5" style={{background: 'rgba(0,255,136,0.3)'}}>
                        <div className="w-4 h-4 rounded-full ml-auto" style={{background: '#00ff88'}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}