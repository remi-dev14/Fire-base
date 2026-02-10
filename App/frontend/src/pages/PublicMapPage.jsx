import React, { useEffect, useState } from 'react'
import LeafletMap from '../components/LeafletMap'
import SummaryTable from '../components/SummaryTable'
import { fetchPublicReports, fetchPublicStats } from '../services/publicApi'

export default function PublicMapPage(){
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(()=>{
    fetchPublicReports().then(r=> setReports(r))
    fetchPublicStats().then(s=> setStats(s))
  },[])

  return (
    <div>
      <h1>Carte publique — Signalements</h1>
      <p>Survolez un point pour voir les infos (date, statut, surface, budget, entreprise, photos)</p>
      <LeafletMap reports={reports} />
      <SummaryTable stats={stats} />

      <section style={{marginTop:12}}>
        <h2>Liste des signalements (sample)</h2>
        <ul>
          {reports.map(r=> (
            <li key={r.id}>{r.date} — {r.status} — {r.surface} m² — {r.company}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
