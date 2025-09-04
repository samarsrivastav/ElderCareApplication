import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * Hero section component for Contact page
 * @returns JSX.Element
 */
const ContactHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <Title level={1} className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Contact Us
        </Title>
        <Paragraph className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          We're here to help you find the perfect care solution for your loved ones. 
          Reach out to us anytime - we're available 24/7 for your peace of mind.
        </Paragraph>
      </div>
    </section>
  );
};

export default ContactHero;
