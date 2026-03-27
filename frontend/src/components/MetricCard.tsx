import React from 'react'
import { FiTrendingUp, FiBook, FiAlertCircle, FiUsers } from 'react-icons/fi'

interface MetricCardProps {
  icon: React.ReactNode
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down'
  color: 'indigo' | 'purple' | 'pink' | 'blue'
}

export default function MetricCard({
  icon,
  title,
  value,
  subtitle,
  trend,
  color,
}: MetricCardProps) {
  const colorClasses = {
    indigo: 'from-indigo-500/10 to-indigo-500/5 dark:from-indigo-900/20 dark:to-indigo-800/10 border-indigo-200 dark:border-indigo-700',
    purple: 'from-purple-500/10 to-purple-500/5 dark:from-purple-900/20 dark:to-purple-800/10 border-purple-200 dark:border-purple-700',
    pink: 'from-pink-500/10 to-pink-500/5 dark:from-pink-900/20 dark:to-pink-800/10 border-pink-200 dark:border-pink-700',
    blue: 'from-blue-500/10 to-blue-500/5 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-700',
  }

  const iconColorClasses = {
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
    pink: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 transition-all hover:shadow-lg hover:scale-105 cursor-pointer`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColorClasses[color]}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-4">
          <FiTrendingUp className={`w-4 h-4 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '+' : '-'}12% this month
          </span>
        </div>
      )}
    </div>
  )
}
