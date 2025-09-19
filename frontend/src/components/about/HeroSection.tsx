import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * Hero section component for About page
 * @returns JSX.Element
 */
const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <Title level={1} className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          About AGEVAA
        </Title>
        <Paragraph className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          For over 15 years, we have been dedicated to providing exceptional senior living solutions 
          that prioritize comfort, dignity, and quality of life for our residents and peace of mind for their families.
        </Paragraph>
      </div>
    </section>
  );
};

export default HeroSection;
