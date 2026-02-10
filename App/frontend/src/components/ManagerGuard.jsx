import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ManagerGuard({ children }){
  const auth = useAuth()
  if(!auth.isAuthenticated) return <Navigate to="/login" replace />
  if(!auth.isManager) return <div style={{padding:20}}>Accès refusé: utilisateur non manager.</div>
  return <>{children}</>
}
