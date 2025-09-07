import React from 'react';
import { Typography } from 'antd';
import { getMissionStatement } from '../../utils/about';

const { Title, Paragraph } = Typography;

/**
 * Mission section component for About page
 * @returns JSX.Element
 */
const MissionSection: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <Title level={2} className="text-4xl font-bold text-gray-800 mb-6">
          Our Mission
        </Title>
        <Paragraph className="text-xl text-gray-600 leading-relaxed">
          {getMissionStatement()}
        </Paragraph>
      </div>
    </section>
  );
};

export default MissionSection;
