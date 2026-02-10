import React, { useEffect, useState } from 'react'
import { loadUsers, unblockUser } from '../services/userApi'

export default function UserManagementPage(){
  const [users, setUsers] = useState([])

  useEffect(()=>{
    loadUsers().then(u=> setUsers(u))
  },[])

  async function onUnblock(id){
    await unblockUser(id)
    const u = await loadUsers()
    setUsers(u)
  }

  return (
    <div>
      <h1>Gestion des utilisateurs</h1>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr><th>ID</th><th>Email</th><th>Role</th><th>Blocked</th><th>Action</th></tr></thead>
        <tbody>
          {users.map(u=> (
            <tr key={u.id} style={{borderTop:'1px solid #eee'}}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{String(u.blocked)}</td>
              <td>{u.blocked ? <button onClick={()=>onUnblock(u.id)}>Débloquer</button> : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
