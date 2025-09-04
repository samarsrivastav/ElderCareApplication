import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface RatingPieChartProps {
  ratings: {
    lifestyle: number;
    medical: number;
    services: number;
    community: number;
  };
  className?: string;
}

/**
 * Pie chart component for displaying room ratings
 * @param props - Component props
 * @returns JSX.Element
 */
const RatingPieChart: React.FC<RatingPieChartProps> = ({
  ratings,
  className = '',
}) => {
  const data = [
    { name: 'Lifestyle', value: ratings.lifestyle, color: '#0ea5e9' },
    { name: 'Medical', value: ratings.medical, color: '#10b981' },
    { name: 'Services', value: ratings.services, color: '#f59e0b' },
    { name: 'Community', value: ratings.community, color: '#8b5cf6' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Rating: <span className="font-semibold">{payload[0].value}/10</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={`shadow-sm ${className}`}>
      <Title level={4} className="text-center mb-4">
        Rating Breakdown
      </Title>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RatingPieChart;
