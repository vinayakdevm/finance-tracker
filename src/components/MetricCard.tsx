import React from 'react';
import { Video as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { MetricTrend } from '../types';

interface MetricCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'purple';
  trend: MetricTrend | null;
  subtitle: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  icon: Icon,
  color,
  trend,
  subtitle
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
  };

  const trendColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg border ${colorClasses[color]} transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:text-3xl">
          {formatAmount(amount)}
        </span>
      </div>
      
      <div className="flex items-center space-x-2 text-sm">
        {trend && (
          <div className={`flex items-center space-x-1 ${
            trend.isPositive ? trendColors.positive : trendColors.negative
          } transition-all duration-300 group-hover:scale-110`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4 animate-bounce" />
            ) : (
              <TrendingDown className="w-4 h-4 animate-bounce" />
            )}
            <span className="font-medium">
              {trend.isPositive ? '+' : '-'}{trend.value.toFixed(1)}%
            </span>
          </div>
        )}
        <span className="text-gray-500 dark:text-gray-400">{subtitle}</span>
      </div>
      </div>
    </div>
  );
};

export default MetricCard;