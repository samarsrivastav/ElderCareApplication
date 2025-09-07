import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { 
  HeartOutlined, 
  TeamOutlined, 
  SafetyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { getValuesData } from '../../utils/about';

const { Title, Paragraph } = Typography;

/**
 * Values section component for About page
 * @returns JSX.Element
 */
const ValuesSection: React.FC = () => {
  const valuesData = getValuesData();
  
  const iconMap = {
    HeartOutlined: <HeartOutlined />,
    TeamOutlined: <TeamOutlined />,
    SafetyOutlined: <SafetyOutlined />,
    ClockCircleOutlined: <ClockCircleOutlined />,
  };
  
  const values = valuesData.map(value => ({
    ...value,
    icon: React.cloneElement(iconMap[value.icon as keyof typeof iconMap], {
      className: `text-4xl ${value.iconColor}`
    })
  }));

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Title level={2} className="text-4xl font-bold text-gray-800 mb-4">
            Our Core Values
          </Title>
          <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
            These fundamental principles guide everything we do and shape the care we provide.
          </Paragraph>
        </div>
        
        <Row gutter={[32, 32]} justify="center">
          {values.map((value, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <Card 
                className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                styles={{ body: { padding: '2rem 1.5rem' } }}
              >
                <div className="mb-4">
                  {value.icon}
                </div>
                <Title level={3} className="text-xl font-semibold text-gray-800 mb-3">
                  {value.title}
                </Title>
                <Paragraph className="text-gray-600">
                  {value.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default ValuesSection;
