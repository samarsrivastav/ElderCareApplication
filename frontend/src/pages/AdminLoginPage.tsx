import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Alert,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { adminService } from '../services/adminService';

const { Title, Text } = Typography;

/**
 * Admin login page component
 * @returns JSX.Element
 */
const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: { username: string; password: string }): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.login(values);
      
      if (response.success) {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="/AGEVAA.jpeg" 
                alt="AGEVAA Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <Title level={2} className="text-2xl font-bold text-gray-800 mb-2">
              AGEVAA Admin
            </Title>
            <Text className="text-gray-600">
              Sign in to manage your content
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-6"
            />
          )}

          <Form
            name="admin-login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              label="Username or Email"
              rules={[
                { required: true, message: 'Please enter your username or email' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter username or email"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter password"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 text-lg font-semibold"
                icon={<LoginOutlined />}
                loading={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;
