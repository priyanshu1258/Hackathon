function StatCard({ icon, title, value, unit, trend, trendValue, color }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1" style={{ borderTop: `4px solid ${color}` }}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl w-14 h-14 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, color: color }}>
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
        {value} <span className="text-lg font-medium text-slate-500 dark:text-slate-400">{unit}</span>
      </div>
      {trend && (
        <div className={`flex items-center gap-2 text-sm ${trend === 'up' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
          <span className="text-lg font-bold">{trend === 'up' ? '↑' : '↓'}</span>
          <span className="font-semibold">{trendValue}</span>
          <span className="text-slate-500 dark:text-slate-400">vs last period</span>
        </div>
      )}
    </div>
  )
}

export default StatCard
