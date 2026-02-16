'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Auth() {
  const [aba, setAba] = useState<'login' | 'register'>('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(senha)}`
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail)
      localStorage.setItem('token', data.access_token)
      router.push('/dashboard')
    } catch (e: any) {
      setErro(e.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister() {
    setLoading(true)
    setErro('')
    setSucesso('')
    try {
      const res = await fetch('http://localhost:8000/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail)
      setSucesso('Conta criada com sucesso! Faça login.')
      setAba('login')
      setNome('')
    } catch (e: any) {
      setErro(e.message || 'Erro ao registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#060910] flex items-center justify-center p-4" style={{fontFamily: "'DM Sans', sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      
      <div className="fixed inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)', backgroundSize: '50px 50px'}} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10" style={{background: 'radial-gradient(circle, #00ff88 0%, transparent 70%)'}} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: 'linear-gradient(135deg, #00ff88, #00cc6a)'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#060910" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="text-white text-xl font-semibold tracking-tight" style={{fontFamily: "'Space Mono', monospace"}}>LGPD<span style={{color: '#00ff88'}}>audit</span></span>
          </div>
          <p className="text-gray-500 text-sm">Sistema de Auditoria com Inteligência Artificial</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 border" style={{background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)'}}>
          
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-8" style={{background: 'rgba(255,255,255,0.05)'}}>
            {(['login', 'register'] as const).map(tab => (
              <button key={tab} onClick={() => { setAba(tab); setErro(''); setSucesso('') }}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: aba === tab ? 'rgba(0,255,136,0.15)' : 'transparent',
                  color: aba === tab ? '#00ff88' : '#6b7280',
                  border: aba === tab ? '1px solid rgba(0,255,136,0.25)' : '1px solid transparent'
                }}>
                {tab === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {aba === 'register' && (
              <div>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">Nome completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Pedro Telles"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none text-sm"
                  style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
                />
              </div>
            )}

            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none text-sm"
                style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none text-sm"
                style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
                onKeyDown={e => e.key === 'Enter' && (aba === 'login' ? handleLogin() : handleRegister())}
              />
            </div>

            {erro && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.2)', color: '#ff6b6b'}}>
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88'}}>
                {sucesso}
              </div>
            )}

            <button
              onClick={aba === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-sm transition-all mt-2"
              style={{background: loading ? 'rgba(0,255,136,0.5)' : 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#060910'}}
            >
              {loading ? 'Aguarde...' : aba === 'login' ? 'Entrar no sistema' : 'Criar minha conta'}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Arquitetura Zero-Knowledge • Dados protegidos por AES-256
        </p>
      </div>
    </main>
  )
}