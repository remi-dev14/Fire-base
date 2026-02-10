import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getReport, saveReport } from '../services/signalementApi'
import { useReports } from '../context/ReportsContext'

export default function SignalementEditPage(){
  const { id } = useParams()
  const nav = useNavigate()
  const { updateReport } = useReports()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    getReport(id).then(r=>{ setReport(r); setLoading(false) })
  },[id])

  if(loading) return <div>Chargement...</div>
  if(!report) return <div>Signalement introuvable</div>

  function onChange(field, value){
    setReport(prev => ({ ...prev, [field]: value }))
  }

  async function onSave(){
    await saveReport(report)
    updateReport(report)
    nav('/manager/signalements')
  }

  return (
    <div>
      <h1>Édition Signalement #{report.id}</h1>
      <div className="card" style={{maxWidth:800}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <label>
            Statut
            <select value={report.status} onChange={e=>onChange('status', e.target.value)}>
              <option value="nouveau">nouveau</option>
              <option value="en_cours">en_cours</option>
              <option value="termine">termine</option>
            </select>
          </label>
          <label>
            Surface (m²)
            <input value={report.surface} onChange={e=>onChange('surface', Number(e.target.value))} />
          </label>
          <label>
            Budget
            <input value={report.budget} onChange={e=>onChange('budget', Number(e.target.value))} />
          </label>
          <label>
            Entreprise
            <input value={report.company} onChange={e=>onChange('company', e.target.value)} />
          </label>
        </div>

        <section style={{marginTop:16}}>
          <h3>Dates par statut</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:12}}>
            <label>
              Nouveau
              <input type="date" value={report.datesByStatus?.nouveau || ''} onChange={e=> setReport(prev=> ({...prev, datesByStatus:{...(prev.datesByStatus||{}), nouveau: e.target.value}}))} />
            </label>
            <label>
              En cours
              <input type="date" value={report.datesByStatus?.en_cours || ''} onChange={e=> setReport(prev=> ({...prev, datesByStatus:{...(prev.datesByStatus||{}), en_cours: e.target.value}}))} />
            </label>
            <label>
              Terminé
              <input type="date" value={report.datesByStatus?.termine || ''} onChange={e=> setReport(prev=> ({...prev, datesByStatus:{...(prev.datesByStatus||{}), termine: e.target.value}}))} />
            </label>
          </div>
        </section>

        <section style={{marginTop:16}}>
          <h3>Historique des statuts</h3>
          <ol>
            {(report.history||[]).map((h, idx)=> (
              <li key={idx}>{h.date} — {h.status}</li>
            ))}
          </ol>
        </section>

        <div style={{marginTop:12,display:'flex',gap:8}}>
          <button onClick={onSave} className="">Enregistrer</button>
          <button onClick={()=> nav('/manager/signalements')} className="secondary">Annuler</button>
        </div>
      </div>
    </div>
  )
}
