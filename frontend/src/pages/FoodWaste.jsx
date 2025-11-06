import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import StatCard from '../components/StatCard'
import { fetchLatestByCategory, fetchReadings, setupSocketListeners } from '../services/api'

function FoodWaste() {
  const [selectedPeriod, setSelectedPeriod] = useState('Today')
  const [selectedBuilding, setSelectedBuilding] = useState('Cafeteria')
  const [stats, setStats] = useState({ current: 0, daily: 0, monthly: 0, reduction: 18 })
  const [buildingData, setBuildingData] = useState([
    { name: 'Cafeteria', waste: 0, meals: 450, wastePerMeal: 0, status: 'normal' },
    { name: 'Hostel-A', waste: 0, meals: 200, wastePerMeal: 0, status: 'normal' },
    { name: 'Labs', waste: 0, meals: 50, wastePerMeal: 0, status: 'normal' }
  ])
  const [chartData, setChartData] = useState([])

  const periods = ['Today', 'This Week', 'This Month']
  const buildings = ['Cafeteria', 'Hostel-A', 'Labs']

  useEffect(() => {
    loadFoodWasteData()
    const cleanup = setupSocketListeners((update) => {
      if (update.category === 'food') {
        loadFoodWasteData()
      }
    })
    return cleanup
  }, [])

  useEffect(() => {
    if (selectedBuilding) {
      loadBuildingHistory(selectedBuilding)
    }
  }, [selectedBuilding])

  const loadFoodWasteData = async () => {
    const data = await fetchLatestByCategory('food')
    if (data) {
      const buildings = ['Cafeteria', 'Hostel-A', 'Labs']
      const mealCounts = { 'Cafeteria': 450, 'Hostel-A': 200, 'Labs': 50 }
      
      let total = 0
      
      const updatedBuildings = buildings.map(building => {
        const waste = Math.round((data[building]?.value || 0) * 10) / 10
        const meals = mealCounts[building]
        const wastePerMeal = Math.round((waste / meals) * 1000) / 1000
        const status = wastePerMeal > 0.07 ? 'warning' : 'good'
        
        total += waste
        
        return { name: building, waste, meals, wastePerMeal, status }
      })

      setBuildingData(updatedBuildings)
      setStats({
        current: Math.round(total * 10) / 10,
        daily: Math.round(total * 1.15 * 10) / 10,
        monthly: Math.round(total * 30 * 10) / 10,
        reduction: 18
      })
    }
  }

  const loadBuildingHistory = async (building) => {
    const history = await fetchReadings('food', building, 20)
    if (history && history.length > 0) {
      const formatted = history.reverse().map(reading => ({
        time: reading.time,
        waste: Math.round(reading.value * 10) / 10,
        building: reading.building
      }))
      setChartData(formatted)
    }
  }

  const insights = [
    { icon: '📉', text: 'Food waste decreased by 18% this month', type: 'positive' },
    { icon: '⚠️', text: 'Lunch service shows highest waste', type: 'warning' },
    { icon: '🎯', text: 'On track to meet monthly reduction goal', type: 'info' },
  ]

  const tips = [
    '🍽️ Take only what you can eat - you can always get more',
    '📏 Start with smaller portions',
    '♻️ Compost food waste when possible',
    '🥗 Choose items you know you will eat',
    '⏰ Proper meal timing reduces waste'
  ]

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">🍽️ Food Waste Monitoring</h1>
          <p className="text-slate-600 dark:text-slate-400">Track and reduce cafeteria food waste across campus</p>
        </div>
        <select 
          className="px-5 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium cursor-pointer hover:border-green-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          {periods.map(period => (
            <option key={period} value={period}>{period}</option>
          ))}
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon="🍽️"
          title="Current Waste"
          value={stats.current}
          unit="kg"
          color="#10b981"
        />
        <StatCard
          icon="📅"
          title="Daily Average"
          value={stats.daily}
          unit="kg"
          color="#06b6d4"
        />
        <StatCard
          icon="📊"
          title="Monthly Total"
          value={stats.monthly}
          unit="kg"
          color="#8b5cf6"
        />
        <StatCard
          icon="🌱"
          title="Waste Reduced"
          value={stats.reduction}
          unit="%"
          trend="down"
          trendValue="vs last month"
          color="#10b981"
        />
      </div>

      {/* Waste Trend Chart */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Waste Trend</h2>
          <select 
            className="px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium cursor-pointer hover:border-green-500 focus:outline-none"
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
          >
            {buildings.map(building => (
              <option key={building} value={building}>{building}</option>
            ))}
          </select>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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
              <Bar dataKey="waste" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Building/Location Data */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Location-wise Food Waste</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {buildingData.map((location) => (
            <div key={location.name} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border-t-4 border-green-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{location.name}</h3>
                <span className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
                  location.status === 'good' 
                    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-orange-100 dark:bg-amber-900 text-orange-700 dark:text-amber-300'
                }`}>
                  {location.status === 'good' ? '✓ Efficient' : '⚠ Needs Attention'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Waste</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white">{location.waste} kg</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Meals Served</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white">{location.meals}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Waste per Meal</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white">{location.wastePerMeal.toFixed(3)} kg</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Waste Breakdown */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Waste Breakdown</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md space-y-4">
            {wasteBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.category}</span>
                  <span className="text-slate-600 dark:text-slate-400">{item.amount} kg</span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${item.percentage}%`,
                      background: item.color
                    }}
                  ></div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 text-right">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Weekly Trend</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
            <div className="flex items-end justify-between h-48 gap-2">
              {weeklyTrend.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center h-full">
                    <div 
                      className="w-full bg-gradient-to-t from-green-400 to-emerald-500 rounded-t-lg relative flex items-start justify-center pt-2"
                      style={{ height: `${(data.waste / 60) * 100}%`, minHeight: '40px' }}
                    >
                      <span className="text-white text-xs font-bold">{data.waste}</span>
                    </div>
                  </div>
                  <div className="text-xs mt-2 text-slate-600 dark:text-slate-400 font-medium">{data.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <div key={index} className={`flex items-center gap-3 p-4 rounded-lg font-medium ${
              insight.type === 'positive' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' : 
              insight.type === 'warning' ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300' :
              'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
            }`}>
              <span className="text-2xl">{insight.icon}</span>
              <span>{insight.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reduction Tips */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Food Waste Reduction Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((tip, index) => (
            <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg px-5 py-4 text-slate-700 dark:text-slate-300 font-medium">
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FoodWaste
