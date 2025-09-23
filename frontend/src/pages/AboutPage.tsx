import React from 'react';
import {
  HeroSection,
  StatisticsSection,
  ValuesSection,
  MissionSection
} from '../components/about';

/**
 * About page component showcasing company information and values
 * @returns JSX.Element
 */
const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <StatisticsSection />
      <ValuesSection />
      <MissionSection />
    </div>
  );
};

export default AboutPage;