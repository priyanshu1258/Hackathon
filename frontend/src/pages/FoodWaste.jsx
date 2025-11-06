import { useState } from 'react'
import StatCard from '../components/StatCard'

function FoodWaste() {
  const [selectedPeriod, setSelectedPeriod] = useState('Today')

  const periods = ['Today', 'This Week', 'This Month']

  const stats = {
    current: 45,
    daily: 52,
    monthly: 1380,
    reduction: 18
  }

  const buildingData = [
    { name: 'Cafeteria', waste: 35, meals: 450, wastePerMeal: 0.078, status: 'warning' },
    { name: 'Hostel-A', waste: 8, meals: 200, wastePerMeal: 0.040, status: 'good' },
    { name: 'Labs', waste: 2, meals: 50, wastePerMeal: 0.040, status: 'good' }
  ]

  const wasteBreakdown = [
    { category: 'Plate Waste', amount: 18, percentage: 40, color: '#ef4444' },
    { category: 'Preparation Waste', amount: 12, percentage: 27, color: '#f59e0b' },
    { category: 'Spoilage', amount: 10, percentage: 22, color: '#8b5cf6' },
    { category: 'Other', amount: 5, percentage: 11, color: '#64748b' }
  ]

  const weeklyTrend = [
    { day: 'Mon', waste: 48 },
    { day: 'Tue', waste: 52 },
    { day: 'Wed', waste: 45 },
    { day: 'Thu', waste: 50 },
    { day: 'Fri', waste: 55 },
    { day: 'Sat', waste: 42 },
    { day: 'Sun', waste: 40 }
  ]

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
