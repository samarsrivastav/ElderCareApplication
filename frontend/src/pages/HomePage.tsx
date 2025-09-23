import React from 'react';
import { Button, Card, Typography, Space, Row, Col } from 'antd';
import { 
  HeartOutlined, 
  TeamOutlined,
  SafetyOutlined, 
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { HOME_CITIES, SERVICE_MODELS } from '../constants/homeCards';

const { Title, Paragraph } = Typography;

/**
 * Home page component with hero section and features
 * @returns JSX.Element
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const cities = HOME_CITIES;

  const serviceModels = SERVICE_MODELS;

  const features = [
    {
      icon: <HeartOutlined className="text-4xl text-blue-500" />,
      title: 'Compassionate Care',
      description: 'Professional and empathetic care for your loved ones with personalized attention.'
    },
    {
      icon: <TeamOutlined className="text-4xl text-blue-600" />,
      title: 'Expert Team',
      description: 'Qualified caregivers and healthcare professionals dedicated to quality care.'
    },
    {
      icon: <SafetyOutlined className="text-4xl text-blue-700" />,
      title: 'Safe & Secure',
      description: 'Advanced monitoring and safety protocols to ensure peace of mind.'
    },
    {
      icon: <ClockCircleOutlined className="text-4xl text-blue-800" />,
      title: '24/7 Support',
      description: 'Round-the-clock care and support whenever you need it.'
    }
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate('/rooms', { state: { searchQuery: query } });
    }
  };

  const handleCityClick = (city: string) => {
    navigate('/rooms', { state: { searchQuery: city, searchType: 'city' } });
  };

  const handleServiceClick = (service: string) => {
    navigate('/rooms', { state: { searchQuery: service, searchType: 'service' } });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Title level={1} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6">
            Caring for Your Loved Ones
          </Title>
          <Paragraph className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Professional elder care services that provide comfort, dignity, and quality of life 
            for your family members. Our compassionate team ensures personalized care in a safe environment.
          </Paragraph>
          <Space size="large" direction="vertical" className="sm:flex-row">
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/rooms')}
              className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg w-full sm:w-auto"
            >
              Find Rooms
            </Button>
            <Button 
              size="large" 
              onClick={() => navigate('/compare')}
              className="h-12 px-8 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
            >
              Compare Rooms
            </Button>
          </Space>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for rooms, facilities, or locations..."
              className="w-full"
              showSearchButton={true}
            />
          </div>
        </div>
      </section>

      {/* City Cards Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Find retirement homes by City
            </Title>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {cities.map((city) => (
              <Card 
                key={city.name}
                className="text-center border-0 transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden"
                styles={{ body: { padding: 0 } }}
                onClick={() => handleCityClick(city.name)}
              >
                <div className="w-full h-24">
                  <img 
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/image-not-found.svg';
                    }}
                  />
                </div>
                <div className="px-2 py-2">
                  <span className="block text-gray-800 font-semibold text-sm sm:text-base truncate">{city.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Model Cards Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Find retirement homes by Service Model
            </Title>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {serviceModels.map((service) => (
              <Card 
                key={service.name}
                className="text-center border-0 transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden"
                styles={{ body: { padding: 0 } }}
                onClick={() => handleServiceClick(service.name)}
              >
                <div className="w-full h-24">
                  <img 
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/image-not-found.svg';
                    }}
                  />
                </div>
                <div className="px-2 py-2">
                  <span className="block text-gray-800 font-semibold text-xs sm:text-sm md:text-base truncate">{service.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose AGEVAA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Title level={2} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose AGEVAA?
            </Title>
            <Paragraph className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              We combine technology, expertise, and compassion to deliver exceptional care services.
            </Paragraph>
          </div>
          
          <Row gutter={[16, 16]} justify="center">
            {features.map((feature) => (
              <Col xs={24} sm={12} md={8} lg={6} key={feature.title}>
                <Card 
                  className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  styles={{ body: { padding: '1.5rem 1rem' } }}
                >
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <Title level={3} className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </Title>
                  <Paragraph className="text-gray-600 text-sm sm:text-base">
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
