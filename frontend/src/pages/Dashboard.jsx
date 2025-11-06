import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Campus Resource Dashboard</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Real-time monitoring of campus resources</p>
        </div>
        <div className="modern-card px-6 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
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
        <h2 className="text-3xl font-bold gradient-text mb-6">📊 Campus-Wide Resource Comparison</h2>
        
        {/* Combined Bar Chart for All Resources */}
        <div className="modern-card p-6 mb-8 animate-fade-in">
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>All Buildings - All Resources</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={buildingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#64748b"
                tick={{ fill: '#475569', fontSize: 12 }}
                label={{ value: 'Electricity (kWh) / Water (L/10)', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 12 } }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                tick={{ fill: '#475569', fontSize: 12 }}
                label={{ value: 'Food Waste (kg)', angle: 90, position: 'insideRight', style: { fill: '#64748b', fontSize: 12 } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '2px solid var(--border-color)', 
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  padding: '12px',
                  boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '8px' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 600 }}
                iconType="square"
              />
              <Bar yAxisId="left" dataKey="electricity" fill="#f97316" name="⚡ Electricity (kWh)" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="left" dataKey={(data) => data.water / 10} fill="#0ea5e9" name="💧 Water (L/10)" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="food" fill="#10b981" name="🍽️ Food Waste (kg)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Individual Category Charts in Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Electricity Chart */}
          <div className="modern-card p-6 overflow-hidden relative animate-fade-in hover-glow">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-bg-electricity opacity-10 rounded-full blur-3xl"></div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10" style={{ color: 'var(--text-primary)' }}>
              <span className="text-2xl">⚡</span>
              <span className="gradient-electricity-text">Electricity Usage</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={buildingData}
                  dataKey="electricity"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={0}
                  paddingAngle={2}
                  label={({ name, percent, value }) => {
                    if (percent > 0.03) {
                      return `${(percent * 100).toFixed(0)}%`
                    }
                    return ''
                  }}
                  labelLine={true}
                >
                  {buildingData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#f97316', '#fb923c', '#fdba74', '#fcd34d'][index % 4]}
                      strokeWidth={2}
                      stroke="var(--bg-card)"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-card)', 
                    border: '2px solid #f97316', 
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: 'var(--shadow-xl)',
                    backdropFilter: 'blur(10px)'
                  }}
                  labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '14px' }}
                  itemStyle={{ color: 'var(--text-secondary)', fontSize: '13px' }}
                  formatter={(value) => [`${value.toFixed(1)} kWh`, 'Usage']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={40}
                  iconType="circle"
                  iconSize={10}
                  formatter={(value) => (
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Water Chart */}
          <div className="modern-card p-6 overflow-hidden relative animate-fade-in">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-bg-water opacity-10 rounded-full blur-3xl"></div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 relative z-10" style={{ color: 'var(--text-primary)' }}>
              <span className="text-2xl">💧</span>
              <span className="gradient-water-text">Water by Building</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={buildingData}
                  dataKey="water"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => {
                    if (percent > 0.05) {
                      return `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    return ''
                  }}
                  labelLine={true}
                >
                  {buildingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-card)', 
                    border: '2px solid #0ea5e9', 
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                  labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                  formatter={(value, name, props) => [`${value.toFixed(0)} L`, props.payload.name]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Food Waste Chart */}
          <div className="modern-card p-6 overflow-hidden relative animate-fade-in">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-bg-food opacity-10 rounded-full blur-3xl"></div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 relative z-10" style={{ color: 'var(--text-primary)' }}>
              <span className="text-2xl">🍽️</span>
              <span className="gradient-food-text">Food Waste by Building</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={buildingData.filter(b => b.food > 0)}
                  dataKey="food"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => {
                    if (percent > 0.05) {
                      return `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    return ''
                  }}
                  labelLine={true}
                >
                  {buildingData.filter(b => b.food > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-card)', 
                    border: '2px solid #10b981', 
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                  labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                  formatter={(value, name, props) => [`${value.toFixed(1)} kg`, props.payload.name]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Building Cards Grid */}
        <h3 className="text-2xl font-bold gradient-text mb-6">Building-wise Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buildingData.map((building) => (
            <div key={building.name} className="modern-card p-6 animate-scale-in">
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{building.name}</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-bg-electricity flex items-center justify-center text-2xl shadow-md hover:scale-110 transition-transform">⚡</div>
                  <div>
                    <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{building.electricity} kWh</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Electricity</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-bg-water flex items-center justify-center text-2xl shadow-md hover:scale-110 transition-transform">💧</div>
                  <div>
                    <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{building.water} L</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Water</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-bg-food flex items-center justify-center text-2xl shadow-md hover:scale-110 transition-transform">🍽️</div>
                  <div>
                    <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{building.food} kg</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Food Waste</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-3xl font-bold gradient-text mb-6">Detailed Views</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/electricity" className="gradient-bg-electricity text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 premium-btn group">
            <div className="flex items-center gap-4">
              <span className="text-5xl group-hover:scale-110 transition-transform">⚡</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">Electricity Monitor</h3>
                <p className="text-sm text-white/90">Track electricity consumption across campus</p>
              </div>
            </div>
          </Link>
          <Link to="/water" className="gradient-bg-water text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 premium-btn group">
            <div className="flex items-center gap-4">
              <span className="text-5xl group-hover:scale-110 transition-transform">💧</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">Water Monitor</h3>
                <p className="text-sm text-white/90">Monitor water usage and conservation</p>
              </div>
            </div>
          </Link>
          <Link to="/food-waste" className="gradient-bg-food text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 premium-btn group">
            <div className="flex items-center gap-4">
              <span className="text-5xl group-hover:scale-110 transition-transform">🍽️</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">Food Waste Tracker</h3>
                <p className="text-sm text-white/90">Analyze food waste patterns and reduce waste</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
