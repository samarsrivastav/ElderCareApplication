import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';

const { Title } = Typography;

/**
 * Custom tooltip component for the comparison chart
 * @param props - Tooltip props
 * @returns JSX.Element
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`${entry.name}-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}/10</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface ComparisonChartProps {
  data: Array<{
    name: string;
    lifestyle: number;
    medical: number;
    services: number;
    community: number;
    overall: number;
  }>;
  className?: string;
}

/**
 * Bar chart component for comparing room ratings
 * @param props - Component props
 * @returns JSX.Element
 */
const ComparisonChart: React.FC<ComparisonChartProps> = ({
  data,
  className = '',
}) => {

  return (
    <Card className={`shadow-sm ${className}`}>
      <Title level={4} className="text-center mb-4">
        Rating Comparison
      </Title>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 10]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="lifestyle" fill="#0ea5e9" name="Lifestyle" />
          <Bar dataKey="medical" fill="#0284c7" name="Medical" />
          <Bar dataKey="services" fill="#38bdf8" name="Services" />
          <Bar dataKey="community" fill="#0369a1" name="Community" />
          <Bar dataKey="overall" fill="#1e40af" name="Overall" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ComparisonChart;
