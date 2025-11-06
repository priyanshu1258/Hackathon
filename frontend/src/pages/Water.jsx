import { useState, useEffect } from 'react'
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import StatCard from '../components/StatCard'
import { fetchLatestByCategory, fetchReadings, setupSocketListeners } from '../services/api'

function Water() {
  const [selectedBuilding, setSelectedBuilding] = useState('Hostel-A')
  const [stats, setStats] = useState({ current: 0, peak: 0, average: 0, savings: 12 })
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
      let peak = 0
      let peakSource = ''
      
      const updatedBuildings = buildings.map(building => {
        const usage = Math.round(data[building]?.value || 0)
        const target = targets[building]
        const percentage = Math.round((usage / target) * 100)
        const status = percentage > 110 ? 'warning' : percentage < 85 ? 'good' : 'normal'
        
        total += usage
        if (usage > peak) {
          peak = usage
          peakSource = building
        }
        
        return { name: building, usage, target, percentage, status }
      })

      // Calculate water savings by comparing current with historical baseline
      try {
        const historyPromises = buildings.map(b => fetchReadings('water', b, 20))
        const histories = await Promise.all(historyPromises)
        
        let historicalAvg = 0
        let dataPoints = 0
        
        histories.forEach(history => {
          if (history && history.length > 10) {
            const baseline = history.slice(5, 15)
            const baselineSum = baseline.reduce((sum, r) => sum + (r.value || 0), 0)
            historicalAvg += baselineSum / baseline.length
            dataPoints++
          }
        })
        
        const avgHistorical = dataPoints > 0 ? historicalAvg / dataPoints : total
        const currentAvg = total / buildings.length
        const savingsPercent = avgHistorical > 0 ? Math.round(((avgHistorical - currentAvg) / avgHistorical) * 100) : 12
        const actualSavings = Math.max(0, Math.min(savingsPercent, 25)) // Cap between 0-25%
        
        setBuildingData(updatedBuildings)
        setStats({
          current: total,
          peak: Math.round(peak),
          peakSource: peakSource,
          average: Math.round(total / buildings.length),
          savings: actualSavings
        })
      } catch (error) {
        console.error('Error calculating water savings:', error)
        setBuildingData(updatedBuildings)
        setStats({
          current: total,
          peak: Math.round(peak),
          peakSource: peakSource,
          average: Math.round(total / buildings.length),
          savings: 12 // Default fallback
        })
      }
    }
  }

  const loadBuildingHistory = async (building) => {
    try {
      const history = await fetchReadings('water', building, 50) // Increased from 20 to 50 for more detailed graph
      console.log('Water history for', building, ':', history) // Debug log
      
      if (history && history.length > 0) {
        // Don't reverse - keep chronological order (oldest to newest)
        const formatted = history.map(reading => ({
          time: reading.time,
          usage: Number(reading.value).toFixed(0), // Keep as integer
          rawUsage: Number(reading.value), // For calculations
          building: reading.building,
          timestamp: reading.ts || Date.now()
        }))
        console.log('Formatted chart data:', formatted) // Debug log
        setChartData(formatted)
      } else {
        console.log('No history data for', building)
        setChartData([])
      }
    } catch (error) {
      console.error('Error loading building history:', error)
      setChartData([])
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
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">💧 Water Monitoring</h1>
          <p className="text-slate-600 dark:text-slate-400">Track and analyze water consumption across campus</p>
        </div>
        <select 
          aria-label="Select building"
          className="px-5 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
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
          value={stats.current} // Dynamically fetched total usage
          unit="L"
          color="#3b82f6"
        />
        <StatCard
          icon="📈"
          title="Peak Usage"
          value={stats.peak} // Dynamically fetched peak usage
          unit="L"
          color="#ef4444"
          source={stats.peakSource}
        />
        <StatCard
          icon="📊"
          title="Average Usage"
          value={stats.average} // Dynamically calculated average usage
          unit="L"
          color="#f59e0b"
        />
        <StatCard
          icon="🌱"
          title="Water Saved"
          value={stats.savings} // Dynamically set water savings
          unit="%"
          trend="down"
          trendValue="vs target"
          color="#10b981"
        />
      </div>

      {/* Usage Trend Chart */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          💧 Usage Trend - {selectedBuilding}
        </h2>
        <div className="modern-card p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[450px] text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">💧</div>
                <p className="text-xl font-semibold">No data available yet</p>
                <p className="text-sm mt-2 text-slate-400">Historical data will appear here once readings are collected</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={450}>
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="50%" stopColor="#60a5fa" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.05}/>
                  </linearGradient>
                  <filter id="waterShadow" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="0" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="5 5" stroke="#cbd5e1" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b"
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                  angle={-35}
                  textAnchor="end"
                  height={70}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                  label={{ 
                    value: 'Water Usage (Liters)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { fill: '#3b82f6', fontSize: 13, fontWeight: 600 } 
                  }}
                  domain={['dataMin - 50', 'dataMax + 50']}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                    border: '2px solid #3b82f6', 
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    padding: '14px 18px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)'
                  }}
                  formatter={(value, name, props) => {
                    const rawUsage = props.payload.rawUsage;
                    const displayValue = rawUsage ? rawUsage.toFixed(1) : value;
                    return [`${Number(displayValue).toLocaleString()} L`, '💧 Water'];
                  }}
                  labelFormatter={(label) => `🕐 ${label}`}
                  labelStyle={{ color: '#60a5fa', fontWeight: 700, fontSize: 13, marginBottom: '8px', borderBottom: '1px solid #3b82f6', paddingBottom: '6px' }}
                  itemStyle={{ color: '#fff', fontWeight: 600, fontSize: 14 }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '25px', fontSize: '13px', fontWeight: 600 }}
                  iconType="circle"
                  iconSize={10}
                />
                <Area 
                  type="monotone" 
                  dataKey="usage" 
                  fill="url(#waterGradient)"
                  stroke="none"
                  name="Usage Range"
                  animationDuration={1500}
                  animationBegin={0}
                />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#3b82f6" 
                  strokeWidth={3.5} 
                  dot={{ fill: '#fff', stroke: '#3b82f6', strokeWidth: 2.5, r: 4.5 }}
                  activeDot={{ r: 7, fill: '#3b82f6', stroke: '#fff', strokeWidth: 3, filter: 'url(#waterShadow)' }}
                  name="💧 Water Usage (L)"
                  animationDuration={1500}
                  animationBegin={200}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Building Usage */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Building-wise Water Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buildingData.map((building) => (
            <div key={building.name} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:scale-[1.02]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{building.name}</h3>
                <span className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
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
                  className={`h-full rounded-full transition-all duration-500 ${
                    building.status === 'good' ? 'bg-linear-to-r from-green-400 to-emerald-500' :
                    building.status === 'normal' ? 'bg-linear-to-r from-blue-400 to-blue-500' :
                    'bg-linear-to-r from-amber-400 to-orange-500'
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
            {tips.map((tip, index) => (
              <div key={index} className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-5 py-4 text-slate-700 dark:text-slate-300 font-medium hover:shadow-md transition-shadow duration-200">
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Water
