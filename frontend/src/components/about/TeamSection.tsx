import React from 'react';
import { Card, Row, Col, Typography, Avatar, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getTeamMembersData } from '../../utils/about';

const { Title, Paragraph } = Typography;

/**
 * Team section component for About page
 * @returns JSX.Element
 */
const TeamSection: React.FC = () => {
  const teamMembers = getTeamMembersData();

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Title level={2} className="text-4xl font-bold text-gray-800 mb-4">
            Meet Our Expert Team
          </Title>
          <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our dedicated professionals bring years of experience and genuine compassion to every interaction.
          </Paragraph>
        </div>
        
        <Row gutter={[32, 32]} justify="center">
          {teamMembers.map((member, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <Card 
                className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                styles={{ body: { padding: '2rem 1.5rem' } }}
              >
                <Avatar 
                  size={100} 
                  src={member.avatar}
                  icon={<UserOutlined />}
                  className="mb-4"
                />
                <Title level={3} className="text-xl font-semibold text-gray-800 mb-2">
                  {member.name}
                </Title>
                <Paragraph className="text-primary-600 font-medium mb-2">
                  {member.role}
                </Paragraph>
                <Paragraph className="text-gray-500 text-sm mb-4">
                  {member.experience} experience
                </Paragraph>
                <div className="flex flex-wrap justify-center gap-1">
                  {member.specialties.map((specialty, idx) => (
                    <Tag key={idx} color="blue">
                      {specialty}
                    </Tag>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default TeamSection;
