import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function GraficoDecibeis({ sensor }) {
  const [dados, setDados] = useState([])

  useEffect(() => {
    if (!sensor || !sensor.location) return

    fetch(`http://localhost:8000/api/sensores/${sensor.location}/leituras`)
      .then(res => res.json())
      .then(data => setDados(data))
      .catch(err => console.error("Erro ao buscar dados:", err))
  }, [sensor])

  // Evita erro se sensor ainda for indefinido
  if (!sensor || !sensor.location) {
    return <p>Selecione um sensor no mapa.</p>
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Gráfico de dB para {sensor.location}</h3>
      {dados.length === 0 ? (
        <p>Sem dados disponíveis para este sensor.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#ff7300" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default GraficoDecibeis