import React from 'react';

interface LineChartProps {
  data: Array<{
    month: string;
    value: number;
  }>;
  color?: string;
  height?: number;
  showDots?: boolean;
  showArea?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  color = '#3B82F6',
  height = 200,
  showDots = true,
  showArea = false
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const padding = 40;
  const width = 400;
  
  const getX = (index: number) => padding + (index * (width - 2 * padding)) / (data.length - 1);
  const getY = (value: number) => height - padding - ((value - minValue) / range) * (height - 2 * padding);
  
  const pathData = data.map((point, index) => {
    const x = getX(index);
    const y = getY(point.value);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  const areaData = showArea ? `${pathData} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z` : '';

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Area fill */}
        {showArea && (
          <path
            d={areaData}
            fill={color}
            fillOpacity="0.1"
            className="animate-fade-in"
          />
        )}
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500 hover:stroke-width-4"
          style={{
            strokeDasharray: '1000',
            strokeDashoffset: '1000',
            animation: 'drawLine 2s ease-out forwards'
          }}
        />
        
        {/* Data points */}
        {showDots && data.map((point, index) => {
          const x = getX(index);
          const y = getY(point.value);
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="6"
                fill="white"
                stroke={color}
                strokeWidth="3"
                className="transition-all duration-300 hover:r-8 cursor-pointer"
                style={{
                  animation: `fadeInDot 0.5s ease-out ${index * 0.1}s both`
                }}
              />
              
              {/* Tooltip on hover */}
              <g className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                <rect
                  x={x - 30}
                  y={y - 35}
                  width="60"
                  height="25"
                  rx="4"
                  fill="rgba(0, 0, 0, 0.8)"
                />
                <text
                  x={x}
                  y={y - 18}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  ${point.value.toLocaleString()}
                </text>
              </g>
            </g>
          );
        })}
        
        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const value = minValue + (range * ratio);
          const y = getY(value);
          
          return (
            <g key={index}>
              <line
                x1={padding - 5}
                y1={y}
                x2={padding}
                y2={y}
                stroke="#6b7280"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                ${Math.round(value / 1000)}k
              </text>
            </g>
          );
        })}
        
        {/* X-axis labels */}
        {data.map((point, index) => {
          const x = getX(index);
          
          return (
            <g key={index}>
              <line
                x1={x}
                y1={height - padding}
                x2={x}
                y2={height - padding + 5}
                stroke="#6b7280"
                strokeWidth="1"
              />
              <text
                x={x}
                y={height - padding + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {point.month}
              </text>
            </g>
          );
        })}
      </svg>
      
      <style jsx>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes fadeInDot {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LineChart;