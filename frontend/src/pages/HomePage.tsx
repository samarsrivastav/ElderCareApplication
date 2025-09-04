import React from 'react';
import { Button, Card, Row, Col, Typography, Space } from 'antd';
import { HeartOutlined, TeamOutlined, SafetyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

/**
 * Home page component with hero section and features
 * @returns JSX.Element
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <HeartOutlined className="text-4xl text-red-500" />,
      title: 'Compassionate Care',
      description: 'Professional and empathetic care for your loved ones with personalized attention.'
    },
    {
      icon: <TeamOutlined className="text-4xl text-blue-500" />,
      title: 'Expert Team',
      description: 'Qualified caregivers and healthcare professionals dedicated to quality care.'
    },
    {
      icon: <SafetyOutlined className="text-4xl text-green-500" />,
      title: 'Safe & Secure',
      description: 'Advanced monitoring and safety protocols to ensure peace of mind.'
    },
    {
      icon: <ClockCircleOutlined className="text-4xl text-purple-500" />,
      title: '24/7 Support',
      description: 'Round-the-clock care and support whenever you need it.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Title level={1} className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Caring for Your Loved Ones
          </Title>
          <Paragraph className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional elder care services that provide comfort, dignity, and quality of life 
            for your family members. Our compassionate team ensures personalized care in a safe environment.
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/rooms')}
              className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg"
            >
              Find Rooms
            </Button>
            <Button 
              size="large" 
              onClick={() => navigate('/compare')}
              className="h-12 px-8 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Compare Rooms
            </Button>
          </Space>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Title level={2} className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose ElderCare?
            </Title>
            <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine technology, expertise, and compassion to deliver exceptional care services.
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]} justify="center">
            {features.map((feature) => (
              <Col xs={24} sm={12} lg={6} key={feature.title}>
                <Card 
                  className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  styles={{ body: { padding: '2rem 1.5rem' } }}
                >
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <Title level={3} className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </Title>
                  <Paragraph className="text-gray-600">
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Title level={2} className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </Title>
          <Paragraph className="text-xl text-blue-100 mb-8">
            Join thousands of families who trust ElderCare for their loved ones' well-being.
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/rooms')}
            className="bg-white text-blue-600 hover:bg-gray-50 h-12 px-8 text-lg font-semibold"
          >
            Browse Rooms
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
