import React from 'react'
import L from 'leaflet'

export default function ReportMarker({ map, report }){
  React.useEffect(()=>{
    if(!map || !report) return
    let mounted = true
    let marker = null

    // create marker once and try to add it until success or max attempts
    marker = L.marker([report.lat, report.lon])
    const popup = `<div style="min-width:200px"><strong>${report.company}</strong><br/>Date: ${report.date}<br/>Statut: ${report.status}<br/>Surface: ${report.surface} m²<br/>Budget: ${report.budget} Ar<br/><a href=\"#\">Voir photos</a></div>`
    marker.bindPopup(popup)

    let attempts = 0
    const maxAttempts = 20

    const tryAdd = () => {
      if(!mounted) return
      attempts++
      // If pane exists, try to add safely
      try{
        if(map.getPane && map.getPane('markerPane')){
          marker.addTo(map)
          return
        }
      }catch(err){
        console.warn('Failed to add marker (attempt)', attempts, err)
      }

      if(typeof map.whenReady === 'function'){
        // schedule a whenReady check which will try to add when map signals ready
        try{
          map.whenReady(()=>{
            if(!mounted) return
            try{
              if(map.getPane && map.getPane('markerPane')) marker.addTo(map)
              else if(attempts < maxAttempts) setTimeout(tryAdd, 100)
              else console.warn('Giving up adding marker after', attempts, 'attempts')
            }catch(err){ console.warn('Failed to add marker inside whenReady', err); if(attempts < maxAttempts) setTimeout(tryAdd, 100) }
          })
        }catch(e){ if(attempts < maxAttempts) setTimeout(tryAdd, 100) }
      }else{
        if(attempts < maxAttempts) setTimeout(tryAdd, 100)
        else console.warn('Giving up adding marker after', attempts, 'attempts')
      }
    }

    tryAdd()

    return ()=>{
      mounted = false
      try{ if(marker && map && map.removeLayer) map.removeLayer(marker) }catch{}
    }
  },[map, report])
  return null
}
