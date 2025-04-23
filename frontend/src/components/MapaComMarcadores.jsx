import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
})

const MapaComMarcadores = ({ onMarkerClick }) => {
  const [sensores, setSensores] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/sensores')
      .then(res => res.json())
      .then(data => {
        console.log("🌍 Sensores recebidos:", data)  // <-- Adicionado aqui
        setSensores(data)
      })
      .catch(err => console.error("Erro ao buscar sensores:", err))
  }, [])
  

  return (
    <MapContainer center={[-3.7849, -38.556]} zoom={15} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {sensores.map((sensor, index) => (
        <Marker
          key={index}
          position={[sensor.latitude, sensor.longitude]}  // Aqui é necessário ter latitude e longitude
          icon={icon}
          eventHandlers={{
            click: () => onMarkerClick(sensor)
          }}
        >
          <Popup>{sensor.location}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapaComMarcadores