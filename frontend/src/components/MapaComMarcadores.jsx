// src/components/MapaComMarcadores.jsx
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Ícone fixo simples para os marcadores
const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
})

// Exemplo de dados dos sensores — depois vamos puxar do backend
const sensores = [
  { id: 1, local: 'Rua A', latitude: -23.55052, longitude: -46.63331 },
  { id: 2, local: 'Rua B', latitude: -23.5523, longitude: -46.6301 }
]

const MapaComMarcadores = ({ onMarkerClick }) => {
  return (
    <MapContainer center={[-23.55052, -46.63331]} zoom={15} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {sensores.map((sensor) => (
        <Marker
          key={sensor.id}
          position={[sensor.latitude, sensor.longitude]}
          icon={icon}
          eventHandlers={{
            click: () => onMarkerClick(sensor)
          }}
        >
          <Popup>{sensor.local}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapaComMarcadores