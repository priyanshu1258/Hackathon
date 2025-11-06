import { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import StatCard from '../components/StatCard'
import { fetchLatestByCategory, fetchReadings, setupSocketListeners } from '../services/api'

function Electricity() {
  const [selectedBuilding, setSelectedBuilding] = useState('Hostel-A')
  const [stats, setStats] = useState({ current: 0, peak: 0, average: 0, savings: 15 })
  const [buildingData, setBuildingData] = useState([
    { name: 'Hostel-A', usage: 0, capacity: 200, percentage: 0, status: 'normal' },
    { name: 'Library', usage: 0, capacity: 150, percentage: 0, status: 'normal' },
    { name: 'Cafeteria', usage: 0, capacity: 250, percentage: 0, status: 'normal' },
    { name: 'Labs', usage: 0, capacity: 180, percentage: 0, status: 'normal' }
  ])
  const [recentReadings, setRecentReadings] = useState([])
  const [chartData, setChartData] = useState([])

  const buildings = ['Hostel-A', 'Library', 'Cafeteria', 'Labs']

  useEffect(() => {
    loadElectricityData()
    const cleanup = setupSocketListeners((update) => {
      if (update.category === 'electricity') {
        loadElectricityData()
      }
    })
    return cleanup
  }, [])

  useEffect(() => {
    if (selectedBuilding) {
      loadBuildingHistory(selectedBuilding)
    }
  }, [selectedBuilding])

  const loadElectricityData = async () => {
    const data = await fetchLatestByCategory('electricity')
    if (data) {
      const buildings = ['Hostel-A', 'Library', 'Cafeteria', 'Labs']
      const capacities = { 'Hostel-A': 200, 'Library': 150, 'Cafeteria': 250, 'Labs': 180 }
      
      let total = 0
      let peak = 0
      
      const updatedBuildings = buildings.map(building => {
        const usage = Math.round(data[building]?.value || 0)
        const capacity = capacities[building]
        const percentage = Math.round((usage / capacity) * 100)
        const status = percentage > 75 ? 'warning' : 'normal'
        
        total += usage
        if (usage > peak) peak = usage
        
        return { name: building, usage, capacity, percentage, status }
      })

      setBuildingData(updatedBuildings)
      setStats({
        current: total,
        peak: peak,
        average: Math.round(total / buildings.length),
        savings: 15
      })

      // Update recent readings
      const readings = buildings.map(building => ({
        time: data[building]?.time || '00:00',
        value: Math.round(data[building]?.value || 0),
        building: building
      }))
      setRecentReadings(readings)
    }
  }

  const loadBuildingHistory = async (building) => {
    const history = await fetchReadings('electricity', building, 20)
    if (history && history.length > 0) {
      const formatted = history.reverse().map(reading => ({
        time: reading.time,
        value: Math.round(reading.value),
        building: reading.building
      }))
      setChartData(formatted)
    }
  }

  const tips = [
    '💡 Switch off lights when leaving rooms',
    '🌡️ Set AC temperature to 24°C for optimal efficiency',
    '🖥️ Enable power-saving mode on computers',
    '⏰ Schedule equipment usage during off-peak hours'
  ]

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">⚡ Electricity Monitoring</h1>
          <p className="text-slate-600 dark:text-slate-400">Track and analyze electricity consumption across campus</p>
        </div>
        <select 
          className="px-5 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium cursor-pointer hover:border-amber-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
        >
          {buildings.map(building => (
            <option key={building} value={building}>{building}</option>
          ))}
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon="⚡"
          title="Current Usage"
          value={stats.current}
          unit="kWh"
          color="#f59e0b"
        />
        <StatCard
          icon="📈"
          title="Peak Usage"
          value={stats.peak}
          unit="kWh"
          color="#ef4444"
        />
        <StatCard
          icon="📊"
          title="Average Usage"
          value={stats.average}
          unit="kWh"
          color="#3b82f6"
        />
        <StatCard
          icon="🌱"
          title="Energy Saved"
          value={stats.savings}
          unit="%"
          trend="down"
          trendValue="vs target"
          color="#10b981"
        />
      </div>

      {/* Historical Chart */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Usage Trend - {selectedBuilding}</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }} 
              />
              <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorElectricity)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Building Usage */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Building-wise Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buildingData.map((building) => (
            <div key={building.name} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border-t-4 border-amber-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{building.name}</h3>
                <span className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
                  building.status === 'normal' 
                    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-orange-100 dark:bg-amber-900 text-orange-700 dark:text-amber-300'
                }`}>
                  {building.status === 'normal' ? '✓ Normal' : '⚠ High'}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {building.usage} <span className="text-lg font-medium text-slate-500 dark:text-slate-400">/ {building.capacity} kWh</span>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full rounded-full ${
                    building.status === 'normal' 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                      : 'bg-gradient-to-r from-amber-400 to-orange-500'
                  }`}
                  style={{ width: `${building.percentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{building.percentage}% of capacity</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Readings */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Recent Readings</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
            {recentReadings.map((reading, index) => (
              <div key={index} className={`flex justify-between items-center px-6 py-4 ${index !== recentReadings.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{reading.time}</div>
                <div className="text-base font-medium text-slate-700 dark:text-slate-300">{reading.building}</div>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{reading.value} kWh</div>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Saving Tips */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Energy Saving Tips</h2>
          <div className="space-y-3">
            {tips.map((tip, index) => (
              <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg px-5 py-4 text-slate-700 dark:text-slate-300 font-medium">
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Electricity
