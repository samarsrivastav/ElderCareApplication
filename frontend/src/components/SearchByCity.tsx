import React, { useState } from 'react';
import { Card, Typography, Button } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface SearchByCityProps {
  className?: string;
}

/**
 * Search by city component with predefined city options
 * @param props - Component props
 * @returns JSX.Element
 */
const SearchByCity: React.FC<SearchByCityProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>('');

  const cities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Surat',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Pimpri-Chinchwad',
    'Patna',
    'Vadodara'
  ];

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    navigate('/rooms', { state: { searchQuery: city, searchType: 'city' } });
  };

  const handleViewAllCities = () => {
    navigate('/rooms');
  };

  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <div className="text-center mb-6">
        <div className="text-4xl text-blue-600 mb-4">
          <EnvironmentOutlined />
        </div>
        <Title level={3} className="text-xl font-semibold text-gray-800 mb-2">
          Search by City
        </Title>
        <Text className="text-gray-600">
          Find elder care facilities in your preferred city
        </Text>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
        {cities.slice(0, 10).map((city) => (
          <Button
            key={city}
            type={selectedCity === city ? 'primary' : 'default'}
            size="small"
            onClick={() => handleCitySelect(city)}
            className={`text-xs ${
              selectedCity === city
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            {city}
          </Button>
        ))}
      </div>

      <div className="text-center">
        <Button
          type="link"
          onClick={handleViewAllCities}
          className="text-blue-600 hover:text-blue-700"
        >
          View All Cities
        </Button>
      </div>
    </Card>
  );
};

export default SearchByCity;
