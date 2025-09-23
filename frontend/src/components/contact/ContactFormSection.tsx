import React, { useState } from 'react';
import { Card, Row, Col, Typography, Form, Input, Button } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  SendOutlined,
  UserOutlined
} from '@ant-design/icons';
import { handleContactFormSubmit } from '../../utils/contact';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

/**
 * Contact form section component
 * @returns JSX.Element
 */
const ContactFormSection: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await handleContactFormSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Row gutter={[48, 48]} justify="center">
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

        </Row>
      </div>
    </section>
  );
};

export default ContactFormSection;
