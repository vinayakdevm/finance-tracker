import React, { useMemo, useState } from 'react';
import { Transaction } from '../types';
import { getSpendingChartData } from '../utils/dataCalculations';
import { CreditCard as Edit2, Check, X } from 'lucide-react';

interface SpendingChartProps {
  transactions: Transaction[];
  activeMetric: string;
}

const SpendingChart: React.FC<SpendingChartProps> = ({ transactions, activeMetric }) => {
  const chartData = useMemo(() => getSpendingChartData(transactions), [transactions]);
  const [budgetTarget, setBudgetTarget] = useState(3000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editBudgetValue, setEditBudgetValue] = useState(budgetTarget.toString());

  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.income, d.expenses, Math.abs(d.savings))),
    budgetTarget
  );

  const getMetricValue = (data: any, metric: string) => {
    switch (metric) {
      case 'Income':
        return data.income;
      case 'Expenses':
        return data.expenses;
      case 'Savings':
        return Math.abs(data.savings);
      default:
        return data.expenses;
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'Income':
        return '#10B981';
      case 'Expenses':
        return '#EF4444';
      case 'Savings':
        return '#8B5CF6';
      default:
        return '#3B82F6';
    }
  };

  const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);
  const totalSavings = totalIncome - totalExpenses;
  const avgIncome = chartData.length > 0 ? Math.round(totalIncome / chartData.length) : 0;
  const avgExpenses = chartData.length > 0 ? Math.round(totalExpenses / chartData.length) : 0;
  const avgSavings = chartData.length > 0 ? Math.round(totalSavings / chartData.length) : 0;

  if (chartData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          No transaction data available
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Add some transactions to see your spending analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-750 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg px-3 py-1 text-xs font-medium mb-2 inline-block">
            Income
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${avgIncome.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Avg Monthly Income</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-750 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg px-3 py-1 text-xs font-medium mb-2 inline-block">
            Expenses
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${avgExpenses.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Avg Monthly Expenses</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-750 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <div className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg px-3 py-1 text-xs font-medium mb-2 inline-block">
            Savings
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${avgSavings.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Avg Monthly Savings</div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <div className="flex items-end justify-between space-x-2 h-80 px-4">
          {chartData.map((data, index) => {
            const value = getMetricValue(data, activeMetric);
            const height = maxValue > 0 ? Math.max((value / maxValue) * 280, 8) : 8;
            
            return (
              <div key={data.month} className="flex flex-col items-center flex-1 group">
                <div className="w-full max-w-16 mb-4 relative">
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                    ${value.toLocaleString()}
                  </div>
                  
                  {/* Bar */}
                  <div
                    className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer transform hover:scale-105 relative overflow-hidden"
                    style={{
                      height: `${height}px`,
                      backgroundColor: getMetricColor(activeMetric),
                      minHeight: '8px'
                    }}
                  >
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20"></div>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-30 transform -skew-x-12 transition-all duration-1000 hover:translate-x-full"></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                  {data.month}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Budget Target Line */}
        {maxValue > 0 && (
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400 dark:border-yellow-600 transition-all duration-300"
            style={{
              bottom: `${12 + (budgetTarget / maxValue) * 280}px`
            }}
          >
            <div className="absolute -top-8 right-4 flex items-center space-x-2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-md">
              {isEditingBudget ? (
                <>
                  <input
                    type="number"
                    value={editBudgetValue}
                    onChange={(e) => setEditBudgetValue(e.target.value)}
                    className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      const newValue = parseInt(editBudgetValue);
                      if (!isNaN(newValue) && newValue > 0) {
                        setBudgetTarget(newValue);
                        setIsEditingBudget(false);
                      }
                    }}
                    className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditBudgetValue(budgetTarget.toString());
                      setIsEditingBudget(false);
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Budget Target: ${budgetTarget.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      setEditBudgetValue(budgetTarget.toString());
                      setIsEditingBudget(true);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    title="Edit budget target"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Y-axis labels */}
        {maxValue > 0 && (
          <div className="absolute left-0 top-0 bottom-12 w-16 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>${(maxValue / 1000).toFixed(0)}k</span>
            <span>${((maxValue * 0.75) / 1000).toFixed(1)}k</span>
            <span>${((maxValue * 0.5) / 1000).toFixed(1)}k</span>
            <span>${((maxValue * 0.25) / 1000).toFixed(1)}k</span>
            <span>$0</span>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Savings</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-2 border-dashed border-gray-400"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Budget Target</span>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;