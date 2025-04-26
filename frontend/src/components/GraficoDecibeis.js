import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function GraficoDecibeis({ sensor }) {
  const [dados, setDados] = useState([])

  useEffect(() => {
    if (!sensor?.location) return

    fetch(`http://localhost:8000/api/sensores/${encodeURIComponent(sensor.location)}/leituras`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then(data => {
        const processedData = data
          .map(item => ({
            ...item,
            value: Number(item.value),
            timestamp: new Date(item.timestamp).getTime()
          }))
          .sort((a, b) => a.timestamp - b.timestamp)

        setDados(processedData)
      })
      .catch(err => console.error("Erro na requisição:", err))
  }, [sensor])

  return (
    <div style={{ height: '100%' }}>
      <h3 style={{ marginBottom: '15px', color: '#333' }}>
        {sensor?.location} - Monitoramento de Decibéis
      </h3>
      
      {dados.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Carregando dados...</p>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={dados} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(ts) => 
                new Date(ts).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
              padding={{ left: 20, right: 20 }}
            />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              labelFormatter={(ts) => 
                new Date(ts).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#ff7300"
              strokeWidth={2}
              dot={{ fill: '#ff7300', strokeWidth: 1, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default GraficoDecibeis