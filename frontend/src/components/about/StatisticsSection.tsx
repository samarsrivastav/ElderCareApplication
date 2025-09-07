import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  HeartOutlined, 
  TeamOutlined, 
  SafetyOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { getStatisticsData } from '../../utils/about';

/**
 * Statistics section component for About page
 * @returns JSX.Element
 */
const StatisticsSection: React.FC = () => {
  const statsData = getStatisticsData();
  
  const iconMap = {
    TrophyOutlined: <TrophyOutlined />,
    HeartOutlined: <HeartOutlined />,
    TeamOutlined: <TeamOutlined />,
    SafetyOutlined: <SafetyOutlined />,
  };
  
  const stats = statsData.map(stat => ({
    ...stat,
    icon: iconMap[stat.icon as keyof typeof iconMap]
  }));

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <Row gutter={[32, 32]} justify="center">
          {stats.map((stat, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <Card className="text-center h-full border-0 shadow-lg">
                <div className="text-4xl text-primary-600 mb-4">
                  {stat.icon}
                </div>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ color: '#0ea5e9', fontSize: '2rem', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default StatisticsSection;
