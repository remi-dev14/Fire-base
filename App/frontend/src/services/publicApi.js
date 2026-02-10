// Small mock public API for reports/statistics. Replace with real API calls later.

const sampleReports = [
  { id: 1, lat: -18.8792, lon: 47.5079, date: '2025-11-01', status: 'nouveau', surface: 12.5, budget: 1500, company: 'Entreprise A', photos: ['https://via.placeholder.com/100'], datesByStatus: { nouveau: '2025-11-01' }, history: [{status:'nouveau', date:'2025-11-01'}] },
  { id: 2, lat: -18.8850, lon: 47.5120, date: '2025-11-05', status: 'en_cours', surface: 30, budget: 4500, company: 'Entreprise B', photos: [], datesByStatus: { nouveau: '2025-11-05', en_cours:'2025-11-06' }, history: [{status:'nouveau', date:'2025-11-05'},{status:'en_cours',date:'2025-11-06'}] },
  { id: 3, lat: -18.8700, lon: 47.5000, date: '2025-11-12', status: 'termine', surface: 5, budget: 800, company: 'Entreprise C', photos: ['https://via.placeholder.com/100','https://via.placeholder.com/120'], datesByStatus: { nouveau:'2025-11-12', en_cours:'2025-11-15', termine:'2025-11-20' }, history: [{status:'nouveau',date:'2025-11-12'},{status:'en_cours',date:'2025-11-15'},{status:'termine',date:'2025-11-20'}] }
]

export function fetchPublicReports(){
  return new Promise((res)=> setTimeout(()=> res(sampleReports), 200))
}

export function fetchPublicStats(){
  const total = sampleReports.length
  const surface = sampleReports.reduce((s,r)=> s + (r.surface||0),0)
  const budget = sampleReports.reduce((s,r)=> s + (r.budget||0),0)
  const progressMap = { 'nouveau':0, 'en_cours':50, 'termine':100 }
  const avgProgress = Math.round(sampleReports.reduce((s,r)=> s + (progressMap[r.status]||0),0) / total)
  return new Promise((res)=> setTimeout(()=> res({ total, surface, budget, progress: avgProgress }), 100))
}
