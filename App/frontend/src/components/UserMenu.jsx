import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function UserMenu(){
  const auth = useAuth()
  if(!auth.isAuthenticated) return <Link to="/login">Se connecter</Link>
  return (
    <div style={{display:'inline-flex',gap:8,alignItems:'center'}}>
      <span>{auth.user?.email || 'Utilisateur'}</span>
      <Link to="/manager">Manager</Link>
      <button onClick={auth.logout}>Déconnexion</button>
    </div>
  )
}
