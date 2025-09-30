import React from 'react';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  size?: number;
  strokeWidth?: number;
}

const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  size = 200, 
  strokeWidth = 40 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativePercentage = 0;

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            className="dark:stroke-gray-700"
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
            
            cumulativePercentage += percentage;
            
            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 hover:opacity-80"
                style={{
                  animation: `drawCircle 1s ease-out ${index * 0.2}s both`
                }}
              />
            );
          })}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center space-x-3 group cursor-pointer">
              <div 
                className="w-4 h-4 rounded-full transition-transform duration-300 group-hover:scale-125"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {percentage}%
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ${item.value.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <style jsx>{`
        @keyframes drawCircle {
          from {
            stroke-dasharray: 0 ${circumference};
          }
          to {
            stroke-dasharray: var(--final-dasharray);
          }
        }
      `}</style>
    </div>
  );
};

export default PieChart;