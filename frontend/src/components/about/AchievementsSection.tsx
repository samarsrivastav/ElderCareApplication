import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { getAchievementsData } from '../../utils/about';

const { Title, Paragraph } = Typography;

/**
 * Achievements section component for About page
 * @returns JSX.Element
 */
const AchievementsSection: React.FC = () => {
  const achievements = getAchievementsData();

  return (
    <section className="py-20 px-6 bg-primary-600">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Title level={2} className="text-4xl font-bold text-white mb-4">
            Recognition & Awards
          </Title>
          <Paragraph className="text-xl text-primary-100 max-w-2xl mx-auto">
            Our commitment to excellence has been recognized by industry leaders and families alike.
          </Paragraph>
        </div>
        
        <Row gutter={[32, 32]} justify="center">
          {achievements.map((achievement, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <Card 
                className="text-center h-full border-0 shadow-lg bg-white"
                styles={{ body: { padding: '2rem 1.5rem' } }}
              >
                <div className="text-4xl text-yellow-500 mb-4">
                  <StarFilled />
                </div>
                <Title level={3} className="text-lg font-semibold text-gray-800 mb-2">
                  {achievement.title}
                </Title>
                <Paragraph className="text-primary-600 font-medium mb-1">
                  {achievement.organization}
                </Paragraph>
                <Paragraph className="text-gray-500 text-sm">
                  {achievement.year}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default AchievementsSection;
