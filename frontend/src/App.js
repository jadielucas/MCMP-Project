import React, { useState } from 'react'
import MapaComMarcadores from './components/MapaComMarcadores'
import GraficoDecibeis from './components/GraficoDecibeis'

function App() {
  const [sensorSelecionado, setSensorSelecionado] = useState(null)

  const handleMarkerClick = (sensor) => {
    setSensorSelecionado(sensor)
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Decibelímetros no Mapa</h2>

      {/* Mapa ocupa largura total */}
      <div style={{ width: '100%', height: '60vh' }}>
        <MapaComMarcadores onMarkerClick={handleMarkerClick} />
      </div>

      {/* Mensagem ou gráfico */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {!sensorSelecionado ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            📍 Clique em um marcador no mapa para ver o gráfico de decibéis.
          </p>
        ) : (
          <GraficoDecibeis sensor={sensorSelecionado} />
        )}
      </div>
    </div>
  )
}

export default App