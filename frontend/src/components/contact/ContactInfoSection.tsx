import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { getContactInfoData } from '../../utils/contact';

const { Title, Paragraph, Text } = Typography;

/**
 * Contact information section component
 * @returns JSX.Element
 */
const ContactInfoSection: React.FC = () => {
  const contactInfoData = getContactInfoData();
  
  const iconMap = {
    PhoneOutlined: <PhoneOutlined />,
    MailOutlined: <MailOutlined />,
    EnvironmentOutlined: <EnvironmentOutlined />,
    ClockCircleOutlined: <ClockCircleOutlined />,
  };
  
  const contactInfo = contactInfoData.map(info => ({
    ...info,
    icon: React.cloneElement(iconMap[info.icon as keyof typeof iconMap], {
      className: "text-3xl text-primary-600"
    })
  }));

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Title level={2} className="text-3xl font-bold text-gray-800 mb-4">
            Get in Touch
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Multiple ways to reach us - choose what works best for you
          </Paragraph>
        </div>
        
        <Row gutter={[24, 24]} justify="center">
          {contactInfo.map((info, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <Card 
                className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                styles={{ body: { padding: '2rem 1.5rem' } }}
              >
                <div className="mb-4">
                  {info.icon}
                </div>
                <Title level={3} className="text-xl font-semibold text-gray-800 mb-3">
                  {info.title}
                </Title>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, idx) => (
                    <div key={idx} className="text-gray-700 font-medium">
                      {detail}
                    </div>
                  ))}
                </div>
                <Text className="text-gray-500 text-sm">
                  {info.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default ContactInfoSection;
