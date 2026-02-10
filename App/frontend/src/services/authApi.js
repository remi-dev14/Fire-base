// Simple auth API client. Replace BASE_URL with real backend URL when available.
const BASE_URL = import.meta.env.VITE_API_BASE || ''

export async function loginRequest(email, password){
  // POST /api/auth/login expected to return { token, user }
  const url = `${BASE_URL}/api/auth/login`
  try{
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if(!res.ok){
      const text = await res.text()
      throw new Error(text || 'Login failed')
    }
    const body = await res.json()
    return body
  }catch(e){
    // rethrow for caller to decide fallback
    throw e
  }
}

export function createManagerDefault(){
  // placeholder: backend should provide an endpoint to create manager by default
  return Promise.reject(new Error('Not implemented'))
}
