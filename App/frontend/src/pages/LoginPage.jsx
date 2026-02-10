import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginRequest } from '../services/authApi'

export default function LoginPage(){
  const auth = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      // try real backend login
      const res = await loginRequest(email, password)
      if(res && res.token){
        auth.login(res.token, res.user)
        nav('/manager')
        return
      }
    }catch(e){
      // fallback to stub manager login for development
      console.warn('Backend login failed, falling back to stub:', e.message)
      auth.login('fake-jwt-token', { id:1, email: email || 'manager@example.com', role:'MANAGER' })
      nav('/manager')
      return
    }
  }

  return (
    <div>
      <h1>Manager Login</h1>
      <p className="muted">Authentification locale. Entrez vos identifiants (ou laissez vide et appuyez sur Se connecter pour un stub de dev).</p>
      <form onSubmit={handleSubmit} className="card" style={{display:'flex',flexDirection:'column',gap:12,maxWidth:360}}>
        <label>
          Email
          <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label>
          Mot de passe
          <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        <div style={{display:'flex',gap:8}}>
          <button type="submit">Se connecter</button>
          <button type="button" className="secondary" onClick={()=>{ setEmail(''); setPassword('') }}>Effacer</button>
        </div>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  )
}
