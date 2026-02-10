import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadReports, saveReport } from '../services/signalementApi'

export default function SignalementListPage(){
  const [reports, setReports] = useState([])

  useEffect(()=>{
    loadReports().then(r=> setReports(r || []))
  },[])

  async function changeStatus(id, status){
    const rep = reports.find(r=> r.id === id)
    if(!rep) return
    const updated = { ...rep, status }
    await saveReport(updated)
    // reload to get dates/history updated
    const reloaded = await loadReports()
    setReports(reloaded)
  }

  return (
    <div>
      <h1>Signalements (Manager)</h1>
      <div className="card">
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr><th>ID</th><th>Date</th><th>Status</th><th>Surface</th><th>Budget</th><th>Entreprise</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} style={{borderTop:'1px solid #eee'}}>
                <td>{r.id}</td>
                <td>{r.date}</td>
                <td>{r.status}</td>
                <td>{r.surface}</td>
                <td>{r.budget}</td>
                <td>{r.company}</td>
                <td style={{display:'flex',gap:6,alignItems:'center'}}>
                  <button onClick={()=> changeStatus(r.id, 'nouveau')} className="ghost">nouveau</button>
                  <button onClick={()=> changeStatus(r.id, 'en_cours')} className="">en_cours</button>
                  <button onClick={()=> changeStatus(r.id, 'termine')} className="secondary">termine</button>
                  <Link to={`/manager/signalements/${r.id}`} style={{marginLeft:8}}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
