const KEY = 'mrrojo_users'

const defaultUsers = [
  { id: 1, email: 'manager@example.com', role:'MANAGER', blocked:false },
  { id: 2, email: 'agent1@example.com', role:'AGENT', blocked:false },
  { id: 3, email: 'agent2@example.com', role:'AGENT', blocked:true }
]

export async function loadUsers(){
  const raw = localStorage.getItem(KEY)
  if(raw) return JSON.parse(raw)
  localStorage.setItem(KEY, JSON.stringify(defaultUsers))
  return defaultUsers
}

export async function unblockUser(id){
  const users = await loadUsers()
  const next = users.map(u => u.id === id ? { ...u, blocked:false } : u)
  localStorage.setItem(KEY, JSON.stringify(next))
  return next.find(u=>u.id===id)
}
