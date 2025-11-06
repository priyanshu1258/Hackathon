import { useState } from 'react'
import StatCard from '../components/StatCard'

function Water() {
  const [selectedBuilding, setSelectedBuilding] = useState('All Buildings')

  const buildings = ['All Buildings', 'Hostel-A', 'Library', 'Cafeteria', 'Labs']

  const stats = {
    current: 5430,
    daily: 18500,
    monthly: 485000,
    savings: 12
  }

  const buildingData = [
    { name: 'Hostel-A', usage: 2500, target: 2200, percentage: 114, status: 'warning' },
    { name: 'Library', usage: 600, target: 800, percentage: 75, status: 'good' },
    { name: 'Cafeteria', usage: 4000, target: 3800, percentage: 105, status: 'warning' },
    { name: 'Labs', usage: 800, target: 900, percentage: 89, status: 'normal' }
  ]

  const hourlyData = [
    { hour: '08:00', usage: 3200 },
    { hour: '09:00', usage: 4100 },
    { hour: '10:00', usage: 4800 },
    { hour: '11:00', usage: 5200 },
    { hour: '12:00', usage: 6500 },
    { hour: '13:00', usage: 5800 },
    { hour: '14:00', usage: 5430 }
  ]

  const alerts = [
    { type: 'warning', message: 'Hostel-A usage 14% above target', time: '2 min ago' },
    { type: 'info', message: 'Library showing efficient usage', time: '15 min ago' },
    { type: 'warning', message: 'Cafeteria peak usage detected', time: '1 hour ago' }
  ]

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

      {/* Hourly Consumption Chart */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Today's Hourly Consumption</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
          <div className="flex items-end justify-between h-72 gap-2">
            {hourlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex items-end justify-center h-full">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-lg relative flex items-start justify-center pt-2"
                    style={{ height: `${(data.usage / 6500) * 100}%`, minHeight: '60px' }}
                  >
                    <span className="text-white text-xs font-bold">{data.usage}</span>
                  </div>
                </div>
                <div className="text-xs mt-2 text-slate-600 dark:text-slate-400 font-medium">{data.hour}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Recent Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`flex items-start gap-3 p-4 rounded-lg ${
                alert.type === 'warning' 
                  ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' 
                  : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
              }`}>
                <div className="text-2xl">
                  {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div className="flex-1">
                  <div className="text-slate-800 dark:text-slate-200 font-medium">{alert.message}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Water Saving Tips */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Water Saving Tips</h2>
          <div className="space-y-3">
            {tips.map((tip, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-5 py-4 text-slate-700 dark:text-slate-300 font-medium">
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
