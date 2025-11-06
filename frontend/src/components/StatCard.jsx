function StatCard({ icon, title, value, unit, trend, trendValue, color, source }) {
  // Convert color to gradient class
  const getGradientClass = () => {
    if (color === '#f59e0b') return 'gradient-bg-electricity'
    if (color === '#3b82f6') return 'gradient-bg-water'
    if (color === '#10b981') return 'gradient-bg-food'
    return 'gradient-bg-primary'
  }

  return (
    <div className="modern-card p-6 overflow-hidden relative group animate-scale-in">
      {/* Ambient glow effect */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 ${getGradientClass()} opacity-10 group-hover:opacity-20 rounded-full blur-3xl transition-all duration-500`}></div>
      
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className={`text-3xl w-14 h-14 rounded-xl flex items-center justify-center ${getGradientClass()} text-white shadow-md hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
      </div>
      
      <div className="text-3xl font-extrabold mb-2 relative z-10" style={{ color: 'var(--text-primary)' }}>
        {value} <span className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>{unit}</span>
      </div>
      
      {source && (
        <div className="flex items-center gap-2 text-sm font-medium relative z-10 stats-badge mb-2">
          <span className="text-base">📍</span>
          <span style={{ color: 'var(--text-secondary)' }}>from</span>
          <span className={`font-bold ${getGradientClass().replace('gradient-bg-', 'gradient-') + '-text'}`}>
            {source}
          </span>
        </div>
      )}
      
      {trend && (
        <div className={`flex items-center gap-2 text-sm font-semibold relative z-10 stats-badge ${trend === 'up' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
          <span className="text-base">{trend === 'up' ? '↑' : '↓'}</span>
          <span>{trendValue}</span>
          <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>vs last period</span>
        </div>
      )}
    </div>
  )
}

export default StatCard
