// Mock signalement API using localStorage-backed reports. Replace with backend calls later.
import { fetchPublicReports } from './publicApi'

const KEY = 'mrrojo_reports'

export async function loadReports(){
  const raw = localStorage.getItem(KEY)
  if(raw) return JSON.parse(raw)
  const initial = await fetchPublicReports()
  localStorage.setItem(KEY, JSON.stringify(initial))
  return initial
}

export async function getReport(id){
  const list = await loadReports()
  return list.find(r => String(r.id) === String(id))
}

export async function saveReport(updated){
  const list = await loadReports()
  const next = list.map(r => {
    if(r.id !== updated.id) return r
    // merge and handle status history/dates
    const prevStatus = r.status
    const nextObj = { ...r, ...updated }
    if(prevStatus !== nextObj.status){
      const d = new Date().toISOString().slice(0,10)
      nextObj.datesByStatus = { ...(r.datesByStatus||{}), [nextObj.status]: d }
      nextObj.history = [ ...(r.history||[]), { status: nextObj.status, date: d } ]
    }
    return nextObj
  })
  localStorage.setItem(KEY, JSON.stringify(next))
  return updated
}

export async function addReport(report){
  const list = await loadReports()
  const next = [...list, report]
  localStorage.setItem(KEY, JSON.stringify(next))
  return report
}
