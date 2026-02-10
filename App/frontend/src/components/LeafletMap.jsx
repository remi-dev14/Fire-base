import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ReportMarker from './ReportMarker'

export default function LeafletMap({ reports=[] , onMapReady }){
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)

  useEffect(()=>{
    if(mapRef.current && !map){
      const m = L.map(mapRef.current).setView([-18.8792, 47.5079], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(m)
      setMap(m)
      // Ensure the map recalculates sizes once it has tiles/layout
      try{
        m.whenReady(()=>{
          // small delay to allow container CSS/layout to settle
          setTimeout(()=>{ try{ m.invalidateSize() }catch(e){} }, 150)
          // expose map for debugging and log panes
          try{
            // expose map for debugging
            window.__mr_map__ = m
            // Defensive fix: if Leaflet created _panes as an Array (unexpected), convert to an object and re-init panes
            try{
              if(Array.isArray(m._panes)){
                console.warn('Detected map._panes as Array — converting to object and reinitializing panes')
                const old = m._panes
                const obj = {}
                Object.keys(old).forEach(k=>obj[k]=old[k])
                m._panes = obj
                // try to (re)initialize panes if method exists
                if(typeof m._initPanes === 'function'){
                  try{ m._initPanes() }catch(e){ console.warn('m._initPanes failed', e) }
                }
              }
            }catch(e){console.warn('panes conversion check failed', e)}
            console.debug('Leaflet map ready - panes:', Object.keys(m.getPanes ? m.getPanes() : {}));
          }catch(e){}
          if(onMapReady) onMapReady(m)
        })
      }catch(e){ if(onMapReady) onMapReady(m) }

      const onResize = ()=>{ try{ m.invalidateSize() }catch(e){} }
      window.addEventListener('resize', onResize)
      return ()=>{ window.removeEventListener('resize', onResize); m.remove() }
    }
  },[mapRef, map])

  return (
    <div>
      <div ref={mapRef} id="map" style={{height: '60vh', width: '100%', border: '1px solid #ccc'}}></div>
      {map && reports.map(r => <ReportMarker key={r.id} map={map} report={r} />)}
    </div>
  )
}
