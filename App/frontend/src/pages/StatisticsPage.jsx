import React, { useEffect, useState } from 'react'
import { loadReports } from '../services/signalementApi'

function daysBetween(a,b){
  if(!a || !b) return null
  const da = new Date(a)
  const db = new Date(b)
  const diff = Math.abs(db - da)
  return Math.round(diff / (1000*60*60*24))
}

export default function StatisticsPage(){
  const [reports, setReports] = useState([])
  const [avgDelay, setAvgDelay] = useState(null)

  useEffect(()=>{
    loadReports().then(r=>{
      setReports(r)
      // compute average delay from first date (nouveau) to termine
      const delays = r.map(item => {
        const d1 = item.datesByStatus?.nouveau
        const d2 = item.datesByStatus?.termine
        return daysBetween(d1,d2)
      }).filter(x=> x !== null)
      if(delays.length) setAvgDelay(Math.round(delays.reduce((s,v)=>s+v,0)/delays.length))
    })
  },[])

  const counts = ['nouveau','en_cours','termine'].map(st=> ({ status:st, count: reports.filter(r=> r.status===st).length }))

  const total = reports.length || 1

  return (
    <div className="stats-page">
      <h1>Statistiques</h1>
      <p className="lead">Délai moyen de traitement (jours): <strong>{avgDelay ?? 'N/A'}</strong></p>

      <section className="stats-grid">
        <div className="card">
          <h3>Avancement (répartition)</h3>
          <svg width="300" height="120" viewBox="0 0 300 120" role="img" aria-label="Bar chart">
            {counts.map((c,i)=>{
              const w = (c.count/total) * 260
              const y = 10 + i*36
              return (
                <g key={c.status}>
                  <rect x={20} y={y} width={w} height={24} fill={["#f39c12","#3498db","#2ecc71"][i]} />
                  <text x={24 + w + 6} y={y+16} fontSize="12">{c.count}</text>
                  <text x={6} y={y+16} fontSize="12">{c.status}</text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="card">
          <h3>Détails</h3>
          <table className="small">
            <tbody>
              <tr><td>Total signalements</td><td>{reports.length}</td></tr>
              <tr><td>Surface totale (m²)</td><td>{reports.reduce((s,r)=> s + (r.surface||0),0)}</td></tr>
              <tr><td>Budget total</td><td>{reports.reduce((s,r)=> s + (r.budget||0),0)} Ar</td></tr>
              <tr><td>Avancement moyen</td><td>{reports.reduce((s,r)=> s + ({nouveau:0,en_cours:50,termine:100}[r.status]||0),0)/ (reports.length||1)} %</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section style={{marginTop:20}}>
        <h3>Signalements récents</h3>
        <ol>
          {reports.slice(0,10).map(r=> (
            <li key={r.id}>{r.date} — {r.company} — {r.status} — {r.surface} m²</li>
          ))}
        </ol>
      </section>
    </div>
  )
}
