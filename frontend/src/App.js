import React, { useState } from 'react'
import MapaComMarcadores from './components/MapaComMarcadores'

function App() {
  const [sensorSelecionado, setSensorSelecionado] = useState(null)

  const handleMarkerClick = (sensor) => {
    console.log("Sensor selecionado:", sensor)
    setSensorSelecionado(sensor)
    // depois daqui, vamos carregar o gráfico com os dados do sensor
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Decibelímetros no Mapa</h2>
      <MapaComMarcadores onMarkerClick={handleMarkerClick} />
    </div>
  )
}

export default App