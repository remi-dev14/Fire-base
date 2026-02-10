import React from 'react'

export default function SummaryTable({ stats }){
  if(!stats) return null
  return (
    <div style={{marginTop:10,border:'1px solid #eee',padding:10,display:'flex',gap:20}}>
      <div><strong>Nb signalements</strong><div>{stats.total}</div></div>
      <div><strong>Surface totale (m²)</strong><div>{stats.surface}</div></div>
      <div><strong>Budget total</strong><div>{stats.budget} Ar</div></div>
      <div><strong>Avancement global</strong><div>{stats.progress} %</div></div>
    </div>
  )
}
