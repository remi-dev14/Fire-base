// Mock sync service: simulates pulling/pushing to Firebase/backend
export function simulateSync(onProgress){
  return new Promise((resolve)=>{
    const steps = 5
    let i = 0
    const t = setInterval(()=>{
      i++
      const percent = Math.round((i/steps)*100)
      if(onProgress) onProgress(percent)
      if(i>=steps){
        clearInterval(t)
        resolve({ success:true, pulled: 3, pushed:2, message: 'Sync completed' })
      }
    }, 400)
  })
}
