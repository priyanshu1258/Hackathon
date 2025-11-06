import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import StatCard from '../components/StatCard'
import { fetchLatestByCategory, fetchReadings, setupSocketListeners } from '../services/api'

function Water() {
  const [selectedBuilding, setSelectedBuilding] = useState('Hostel-A')
  const [stats, setStats] = useState({ current: 0, daily: 0, monthly: 0, savings: 12 })
  const [buildingData, setBuildingData] = useState([
    { name: 'Hostel-A', usage: 0, target: 2200, percentage: 0, status: 'normal' },
    { name: 'Library', usage: 0, target: 800, percentage: 0, status: 'normal' },
    { name: 'Cafeteria', usage: 0, target: 3800, percentage: 0, status: 'normal' },
    { name: 'Labs', usage: 0, target: 900, percentage: 0, status: 'normal' }
  ])
  const [chartData, setChartData] = useState([])

  const buildings = ['Hostel-A', 'Library', 'Cafeteria', 'Labs']

  useEffect(() => {
    loadWaterData()
    const cleanup = setupSocketListeners((update) => {
      if (update.category === 'water') {
        loadWaterData()
      }
    })
    return cleanup
  }, [])

  useEffect(() => {
    if (selectedBuilding) {
      loadBuildingHistory(selectedBuilding)
    }
  }, [selectedBuilding])

  const loadWaterData = async () => {
    const data = await fetchLatestByCategory('water')
    if (data) {
      const buildings = ['Hostel-A', 'Library', 'Cafeteria', 'Labs']
      const targets = { 'Hostel-A': 2200, 'Library': 800, 'Cafeteria': 3800, 'Labs': 900 }
      
      let total = 0
      
      const updatedBuildings = buildings.map(building => {
        const usage = Math.round(data[building]?.value || 0)
        const target = targets[building]
        const percentage = Math.round((usage / target) * 100)
        const status = percentage > 110 ? 'warning' : percentage < 85 ? 'good' : 'normal'
        
        total += usage
        
        return { name: building, usage, target, percentage, status }
      })

      setBuildingData(updatedBuildings)
      setStats({
        current: total,
        daily: total * 3,
        monthly: total * 90,
        savings: 12
      })
    }
  }

  const loadBuildingHistory = async (building) => {
    const history = await fetchReadings('water', building, 20)
    if (history && history.length > 0) {
      const formatted = history.reverse().map(reading => ({
        time: reading.time,
        usage: Math.round(reading.value),
        building: reading.building
      }))
      setChartData(formatted)
    }
  }

  const tips = [
    '💧 Fix leaking taps immediately - saves up to 15L/day',
    '🚿 Take shorter showers - reduce by 2 minutes',
    '🌿 Water plants during early morning or evening',
    '♻️ Reuse water where possible (e.g., for gardening)'
  ]

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">💧 Water Monitoring</h1>
          <p className="text-slate-600 dark:text-slate-400">Track and analyze water consumption across campus</p>
        </div>
        <select 
          className="px-5 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
          icon="💧"
          title="Current Usage"
          value={stats.current}
          unit="L"
          color="#3b82f6"
        />
        <StatCard
          icon="📅"
          title="Daily Usage"
          value={stats.daily}
          unit="L"
          color="#06b6d4"
        />
        <StatCard
          icon="📊"
          title="Monthly Usage"
          value={stats.monthly}
          unit="L"
          color="#8b5cf6"
        />
        <StatCard
          icon="💚"
          title="Water Saved"
          value={stats.savings}
          unit="%"
          trend="down"
          trendValue="vs target"
          color="#10b981"
        />
      </div>

      {/* Usage Trend Chart */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Usage Trend - {selectedBuilding}</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
              <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Building Usage */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Building-wise Water Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buildingData.map((building) => (
            <div key={building.name} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border-t-4 border-blue-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{building.name}</h3>
                <span className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
                  building.status === 'good' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 
                  building.status === 'normal' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 
                  'bg-orange-100 dark:bg-amber-900 text-orange-700 dark:text-amber-300'
                }`}>
                  {building.status === 'good' ? '✓ Efficient' : 
                   building.status === 'normal' ? '• Normal' : '⚠ High'}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {building.usage} <span className="text-lg font-medium text-slate-500 dark:text-slate-400">/ {building.target} L</span>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full rounded-full ${
                    building.status === 'good' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 
                    building.status === 'normal' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                    'bg-gradient-to-r from-amber-400 to-orange-500'
                  }`}
                  style={{ width: `${Math.min(building.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {building.percentage}% of target
                {building.percentage > 100 && ' (Over target!)'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* Water Saving Tips */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Water Saving Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-5 py-4 text-slate-700 dark:text-slate-300 font-medium">
              💧 Fix leaking taps immediately - saves up to 15L/day
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-5 py-4 text-slate-700 dark:text-slate-300 font-medium">
              🚿 Take shorter showers - reduce by 2 minutes
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-5 py-4 text-slate-700 dark:text-slate-300 font-medium">
              🌿 Water plants during early morning or evening
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-5 py-4 text-slate-700 dark:text-slate-300 font-medium">
              ♻️ Reuse water where possible (e.g., for gardening)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Water
