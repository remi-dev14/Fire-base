import React, { createContext, useContext, useEffect, useState } from 'react'

const ReportsContext = createContext(null)

export function ReportsProvider({ children }){
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState({ total:0, surface:0, budget:0, progress:0 })

  // placeholder: load sample data from localStorage if any
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('mrrojo_reports')
      if(raw) setReports(JSON.parse(raw))
    }catch(e){}
  },[])

  function setSampleReports(list){
    setReports(list)
    localStorage.setItem('mrrojo_reports', JSON.stringify(list))
  }

  function updateReport(updated){
    setReports(prev => {
      const next = prev.map(r => r.id === updated.id ? { ...r, ...updated } : r)
      localStorage.setItem('mrrojo_reports', JSON.stringify(next))
      return next
    })
  }

  function getReportById(id){
    return reports.find(r => String(r.id) === String(id))
  }

  return (
    <ReportsContext.Provider value={{ reports, setReports: setSampleReports, stats, setStats, updateReport, getReportById }}>
      {children}
    </ReportsContext.Provider>
  )
}

export function useReports(){
  const ctx = useContext(ReportsContext)
  if(!ctx) throw new Error('useReports must be used within ReportsProvider')
  return ctx
}

export default ReportsContext
