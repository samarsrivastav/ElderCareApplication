import React from 'react';
import { Card, Typography, Button } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { getEmergencyContactData } from '../../utils/contact';

const { Title, Paragraph } = Typography;

/**
 * Emergency contact section component
 * @returns JSX.Element
 */
const EmergencyContactSection: React.FC = () => {
  const emergencyData = getEmergencyContactData();
  
  return (
    <section className="py-16 px-6 bg-blue-50">
      <div className="max-w-4xl mx-auto text-center">
        <Card className="border-blue-200 bg-white shadow-lg">
          <div className="text-center">
            <div className="text-4xl text-blue-600 mb-4">
              <PhoneOutlined />
            </div>
            <Title level={2} className="text-2xl font-bold text-gray-800 mb-4">
              Emergency Contact
            </Title>
            <Paragraph className="text-lg text-gray-600 mb-6">
              {emergencyData.description}
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              icon={<PhoneOutlined />}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto"
              href={`tel:${emergencyData.phone}`}
            >
              Call Emergency Line: {emergencyData.phone}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default EmergencyContactSection;
