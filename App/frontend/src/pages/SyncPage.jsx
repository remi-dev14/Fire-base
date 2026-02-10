import React, { useState } from 'react'
import { simulateSync } from '../services/syncApi'

export default function SyncPage(){
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)

  async function run(){
    setResult(null)
    setRunning(true)
    const res = await simulateSync(p=> setProgress(p))
    setResult(res)
    setRunning(false)
  }

  return (
    <div>
      <h1>Synchronisation</h1>
      <p>Synchronisez les signalements avec Firebase / mobile (simulé).</p>
      <div style={{marginTop:8}}>
        <button onClick={run} disabled={running}>Lancer synchronisation</button>
      </div>
      <div style={{marginTop:8}}>
        <div className="card" style={{maxWidth:360}}>
          <div style={{width:'100%',height:12,background:'#eee',borderRadius:8,overflow:'hidden'}}>
            <div style={{width: `${progress}%`, height:12, background:'var(--success)'}} />
          </div>
          <div className="small muted" style={{marginTop:6}}>{progress}%</div>
        </div>
      </div>
      {result && (
        <div style={{marginTop:12}}>
          <strong>Résultat:</strong> {result.message} — pulled: {result.pulled} pushed: {result.pushed}
        </div>
      )}
    </div>
  )
}
