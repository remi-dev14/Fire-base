import React, { createContext, useContext, useEffect, useState } from 'react'

const KEY = 'mrrojo_auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [auth, setAuth] = useState({ token: null, user: null })

  useEffect(()=>{
    try{
      const raw = localStorage.getItem(KEY)
      if(raw){
        setAuth(JSON.parse(raw))
      }
    }catch(e){
      // ignore
    }
  },[])

  function login(token, user){
    const payload = { token, user }
    localStorage.setItem(KEY, JSON.stringify(payload))
    setAuth(payload)
  }

  function logout(){
    localStorage.removeItem(KEY)
    setAuth({ token: null, user: null })
  }

  const isAuthenticated = !!auth.token
  const isManager = !!auth.user && (auth.user.role === 'MANAGER' || auth.user.role === 'manager' || auth.user.role === 'Manager')

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, isAuthenticated, isManager }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  const ctx = useContext(AuthContext)
  if(!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
