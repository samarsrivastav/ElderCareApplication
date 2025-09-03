import React from 'react';
import { Row, Col, Card, Typography, Statistic, Button, Space, Avatar, List, Tag } from 'antd';
import { 
  UserOutlined, 
  HeartOutlined, 
  ClockCircleOutlined, 
  BellOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../stores/authStore';

const { Title, Text } = Typography;

/**
 * Dashboard page component for authenticated users
 * @returns JSX.Element
 */
const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Active Care Plans',
      value: 3,
      icon: <HeartOutlined className="text-2xl text-red-500" />,
      color: 'red'
    },
    {
      title: 'Upcoming Appointments',
      value: 5,
      icon: <CalendarOutlined className="text-2xl text-blue-500" />,
      color: 'blue'
    },
    {
      title: 'Medication Reminders',
      value: 8,
      icon: <MedicineBoxOutlined className="text-2xl text-green-500" />,
      color: 'green'
    },
    {
      title: 'Care Team Members',
      value: 4,
      icon: <TeamOutlined className="text-2xl text-purple-500" />,
      color: 'purple'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      title: 'Doctor Visit',
      description: 'Annual checkup with Dr. Smith',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'medication',
      title: 'Medication Reminder',
      description: 'Blood pressure medication due',
      time: '4 hours ago',
      status: 'pending'
    },
    {
      id: 3,
      type: 'care',
      title: 'Care Plan Update',
      description: 'Physical therapy session completed',
      time: '1 day ago',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <CalendarOutlined className="text-blue-500" />;
      case 'medication':
        return <MedicineBoxOutlined className="text-green-500" />;
      case 'care':
        return <HeartOutlined className="text-red-500" />;
      default:
        return <BellOutlined className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <Title level={1} className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.firstName || 'User'}! 👋
          </Title>
          <Text className="text-gray-600 text-lg">
            Here's what's happening with your care today
          </Text>
        </div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  {stat.icon}
                </div>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ color: `#${stat.color === 'red' ? 'ef4444' : stat.color === 'blue' ? '3b82f6' : stat.color === 'green' ? '10b981' : '8b5cf6'}` }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          {/* Left Column */}
          <Col xs={24} lg={16}>
            {/* Quick Actions */}
            <Card 
              title="Quick Actions" 
              className="mb-6 border-0 shadow-md"
              extra={<Button type="primary">View All</Button>}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Button 
                    type="default" 
                    size="large" 
                    icon={<CalendarOutlined />}
                    className="w-full h-16 text-left"
                    block
                  >
                    <div className="text-left">
                      <div className="font-medium">Schedule Appointment</div>
                      <Text className="text-gray-500 text-sm">Book a new visit</Text>
                    </div>
                  </Button>
                </Col>
                <Col span={12}>
                  <Button 
                    type="default" 
                    size="large" 
                    icon={<MedicineBoxOutlined />}
                    className="w-full h-16 text-left"
                    block
                  >
                    <div className="text-left">
                      <div className="font-medium">Medication Log</div>
                      <Text className="text-gray-500 text-sm">Update meds taken</Text>
                    </div>
                  </Button>
                </Col>
                <Col span={12}>
                  <Button 
                    type="default" 
                    size="large" 
                    icon={<HeartOutlined />}
                    className="w-full h-16 text-left"
                    block
                  >
                    <div className="text-left">
                      <div className="font-medium">Care Plan</div>
                      <Text className="text-gray-500 text-sm">View current plan</Text>
                    </div>
                  </Button>
                </Col>
                <Col span={12}>
                  <Button 
                    type="default" 
                    size="large" 
                    icon={<TeamOutlined />}
                    className="w-full h-16 text-left"
                    block
                  >
                    <div className="text-left">
                      <div className="font-medium">Contact Team</div>
                      <Text className="text-gray-500 text-sm">Message caregivers</Text>
                    </div>
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Recent Activities */}
            <Card 
              title="Recent Activities" 
              className="border-0 shadow-md"
              extra={<Button type="link">View All</Button>}
            >
              <List
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item className="px-0">
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={getActivityIcon(item.type)} 
                          className="bg-gray-100"
                        />
                      }
                      title={
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.title}</span>
                          <Tag color={getStatusColor(item.status)}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div className="text-gray-600">{item.description}</div>
                          <Text className="text-gray-400 text-sm">{item.time}</Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Profile Summary */}
            <Card 
              title="Profile Summary" 
              className="mb-6 border-0 shadow-md"
              extra={<Button type="link" size="small">Edit</Button>}
            >
              <div className="text-center mb-4">
                <Avatar 
                  size={64} 
                  icon={<UserOutlined />} 
                  className="bg-blue-600 mb-3"
                />
                <Title level={4} className="mb-1">
                  {user?.firstName} {user?.lastName}
                </Title>
                <Tag color="blue" className="mb-3">
                  {user?.role?.replace('_', ' ').toUpperCase()}
                </Tag>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text className="text-gray-600">Email:</Text>
                  <Text className="font-medium">{user?.email}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Status:</Text>
                  <Tag color="success">Active</Tag>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Member Since:</Text>
                  <Text className="font-medium">Dec 2024</Text>
                </div>
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card 
              title="Upcoming Events" 
              className="border-0 shadow-md"
              extra={<Button type="link" size="small">View Calendar</Button>}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CalendarOutlined className="text-blue-500" />
                  <div>
                    <div className="font-medium">Doctor Appointment</div>
                    <Text className="text-gray-500 text-sm">Tomorrow, 10:00 AM</Text>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <MedicineBoxOutlined className="text-green-500" />
                  <div>
                    <div className="font-medium">Medication Review</div>
                    <Text className="text-gray-500 text-sm">Dec 15, 2:00 PM</Text>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <TeamOutlined className="text-purple-500" />
                  <div>
                    <div className="font-medium">Care Team Meeting</div>
                    <Text className="text-gray-500 text-sm">Dec 18, 11:00 AM</Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashboardPage;
