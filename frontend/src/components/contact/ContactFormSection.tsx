import React, { useState } from 'react';
import { Card, Row, Col, Typography, Form, Input, Button } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  SendOutlined,
  UserOutlined
} from '@ant-design/icons';
import { getFacilityLocationsData, handleContactFormSubmit } from '../../utils/contact';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

/**
 * Contact form section component
 * @returns JSX.Element
 */
const ContactFormSection: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const locations = getFacilityLocationsData();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await handleContactFormSubmit(values);
      form.resetFields();
    } catch (error) {
      // Error is already handled in the utility function
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Row gutter={[48, 48]}>
          <Col xs={24} lg={12}>
            <Card className="shadow-lg">
              <div className="mb-6">
                <Title level={2} className="text-2xl font-bold text-gray-800 mb-2">
                  Send us a Message
                </Title>
                <Paragraph className="text-gray-600">
                  Have questions about our services? Need to schedule a visit? 
                  Fill out the form below and we'll get back to you promptly.
                </Paragraph>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[{ required: true, message: 'Please enter your first name' }]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="Enter your first name"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[{ required: true, message: 'Please enter your last name' }]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="Enter your last name"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="Enter your email address"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter your phone number' }]}
                >
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="Enter your phone number"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[{ required: true, message: 'Please enter a subject' }]}
                >
                  <Input 
                    placeholder="What is this about?"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="Message"
                  rules={[{ required: true, message: 'Please enter your message' }]}
                >
                  <TextArea 
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large"
                    loading={loading}
                    icon={<SendOutlined />}
                    className="w-full bg-primary-600 hover:bg-primary-700"
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card className="shadow-lg">
              <div className="mb-6">
                <Title level={2} className="text-2xl font-bold text-gray-800 mb-2">
                  Visit Our Facilities
                </Title>
                <Paragraph className="text-gray-600">
                  We have multiple locations to serve you better. 
                  Find the one closest to you and schedule a visit.
                </Paragraph>
              </div>

              <div className="space-y-6">
                {locations.map((location, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <Title level={4} className="text-lg font-semibold text-gray-800 mb-2">
                      {location.name}
                    </Title>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <EnvironmentOutlined className="mr-2 text-primary-600" />
                        <span>{location.address}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <PhoneOutlined className="mr-2 text-primary-600" />
                        <span>{location.phone}</span>
                      </div>
                      <div className="mt-3">
                        <Text className="text-sm text-gray-500">Services:</Text>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {location.services.map((service, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default ContactFormSection;
