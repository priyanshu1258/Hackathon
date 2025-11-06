import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import StatCard from '../components/StatCard'
import { fetchLatestData, setupSocketListeners } from '../services/api'

function Dashboard() {
  const [stats, setStats] = useState({
    electricity: { total: 0, unit: 'kWh', trend: 'down', trendValue: '0%', color: '#f59e0b' },
    water: { total: 0, unit: 'L', trend: 'down', trendValue: '0%', color: '#3b82f6' },
    foodWaste: { total: 0, unit: 'kg', trend: 'up', trendValue: '0%', color: '#10b981' }
  })

  const [buildingData, setBuildingData] = useState([
    { name: 'Hostel-A', electricity: 0, water: 0, food: 0 },
    { name: 'Library', electricity: 0, water: 0, food: 0 },
    { name: 'Cafeteria', electricity: 0, water: 0, food: 0 },
    { name: 'Labs', electricity: 0, water: 0, food: 0 }
  ])

  useEffect(() => {
    // Fetch initial data
    const loadData = async () => {
      const data = await fetchLatestData()
      if (data) {
        updateDashboardData(data)
      }
    }
    
    loadData()

    // Setup real-time updates
    const cleanup = setupSocketListeners((update) => {
      loadData() // Reload all data when any update arrives
    })

    return cleanup
  }, [])

  const updateDashboardData = (data) => {
    // Calculate totals for each category
    const buildings = ['Hostel-A', 'Library', 'Cafeteria', 'Labs']
    
    let totalElectricity = 0
    let totalWater = 0
    let totalFood = 0

    const updatedBuildings = buildings.map(building => {
      const electricity = data.electricity?.[building]?.value || 0
      const water = data.water?.[building]?.value || 0
      const food = data.food?.[building]?.value || 0

      totalElectricity += electricity
      totalWater += water
      totalFood += food

      return { name: building, electricity, water, food }
    })

    setBuildingData(updatedBuildings)
    setStats({
      electricity: { total: Math.round(totalElectricity), unit: 'kWh', trend: 'down', trendValue: '12%', color: '#f59e0b' },
      water: { total: Math.round(totalWater), unit: 'L', trend: 'down', trendValue: '8%', color: '#3b82f6' },
      foodWaste: { total: Math.round(totalFood * 10) / 10, unit: 'kg', trend: 'up', trendValue: '5%', color: '#10b981' }
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">Campus Resource Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Real-time monitoring of campus resources</p>
        </div>
        <div className="bg-slate-200 dark:bg-slate-700 px-5 py-3 rounded-lg text-slate-700 dark:text-slate-300 font-medium border border-slate-300 dark:border-slate-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard
          icon="⚡"
          title="Total Electricity"
          value={stats.electricity.total}
          unit={stats.electricity.unit}
          trend={stats.electricity.trend}
          trendValue={stats.electricity.trendValue}
          color={stats.electricity.color}
        />
        <StatCard
          icon="💧"
          title="Total Water"
          value={stats.water.total}
          unit={stats.water.unit}
          trend={stats.water.trend}
          trendValue={stats.water.trendValue}
          color={stats.water.color}
        />
        <StatCard
          icon="🍽️"
          title="Food Waste"
          value={stats.foodWaste.total}
          unit={stats.foodWaste.unit}
          trend={stats.foodWaste.trend}
          trendValue={stats.foodWaste.trendValue}
          color={stats.foodWaste.color}
        />
      </div>

      {/* Building Breakdown */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Building-wise Consumption</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buildingData.map((building) => (
            <div key={building.name} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">{building.name}</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">⚡</span>
                  <div>
                    <div className="text-lg font-semibold text-slate-800 dark:text-white">{building.electricity} kWh</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Electricity</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">💧</span>
                  <div>
                    <div className="text-lg font-semibold text-slate-800 dark:text-white">{building.water} L</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Water</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">🍽️</span>
                  <div>
                    <div className="text-lg font-semibold text-slate-800 dark:text-white">{building.food} kg</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Food Waste</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Detailed Views</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/electricity" className="flex items-center gap-4 p-6 rounded-xl shadow-md transition-all hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-amber-100 to-amber-300 dark:from-amber-900 dark:to-amber-700">
            <span className="text-4xl">⚡</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Electricity Monitor</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">Track electricity consumption across campus</p>
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-white">→</span>
          </Link>
          <Link to="/water" className="flex items-center gap-4 p-6 rounded-xl shadow-md transition-all hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-700">
            <span className="text-4xl">💧</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Water Monitor</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">Monitor water usage and trends</p>
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-white">→</span>
          </Link>
          <Link to="/food-waste" className="flex items-center gap-4 p-6 rounded-xl shadow-md transition-all hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-emerald-100 to-emerald-300 dark:from-emerald-900 dark:to-emerald-700">
            <span className="text-4xl">🍽️</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Food Waste Monitor</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">Track cafeteria food waste</p>
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-white">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
