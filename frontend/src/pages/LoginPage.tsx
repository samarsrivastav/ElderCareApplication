import React from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

const { Title, Text } = Typography;

/**
 * Login form interface
 */
interface LoginForm {
  email: string;
  password: string;
}

/**
 * Login page component with form validation and authentication
 * @returns JSX.Element
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, setLoading, setError, clearError } = useAuthStore();
  const [form] = Form.useForm();

  /**
   * Handle form submission for login
   * @param values - Form values
   */
  const handleSubmit = async (values: LoginForm) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await authService.login(values.email, values.password);
      
      if (response.success) {
        login(response.data.user, response.data.token);
        message.success('Login successful!');
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-2xl border-0">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🏥</div>
            <Title level={2} className="text-2xl font-bold text-gray-800">
              Welcome Back
            </Title>
            <Text className="text-gray-600">
              Sign in to your ElderCare account
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email"
                className="h-12"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password!' },
                { min: 8, message: 'Password must be at least 8 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                className="h-12"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <Text className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up here
              </Link>
            </Text>
          </div>

          <div className="text-center mt-4">
            <Link 
              to="/forgot-password" 
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Forgot your password?
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
