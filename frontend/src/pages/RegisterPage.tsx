import React from 'react';
import { Form, Input, Button, Card, Typography, Select, DatePicker, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * Registration form interface
 */
interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'caregiver' | 'family_member' | 'patient';
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
  };
}

/**
 * Registration page component with comprehensive form validation
 * @returns JSX.Element
 */
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setLoading, setError, clearError } = useAuthStore();
  const [form] = Form.useForm();

  /**
   * Handle form submission for registration
   * @param values - Form values
   */
  const handleSubmit = async (values: RegisterForm) => {
    try {
      setLoading(true);
      clearError();
      
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...registrationData } = values;
      
      const response = await authService.register(registrationData);
      
      if (response.success) {
        message.success('Registration successful! Please log in.');
        navigate('/login');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl border-0">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🏥</div>
            <Title level={2} className="text-2xl font-bold text-gray-800">
              Create Your Account
            </Title>
            <Text className="text-gray-600">
              Join ElderCare and start your care journey today
            </Text>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            scrollToFirstError
          >
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: 'Please enter your first name!' },
                  { min: 2, message: 'First name must be at least 2 characters!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="First name"
                  className="h-12"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  { required: true, message: 'Please enter your last name!' },
                  { min: 2, message: 'Last name must be at least 2 characters!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Last name"
                  className="h-12"
                />
              </Form.Item>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                  placeholder="Create a password"
                  className="h-12"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Confirm password"
                  className="h-12"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select your role!' }]}
            >
              <Select placeholder="Select your role" className="h-12">
                <Option value="family_member">Family Member</Option>
                <Option value="caregiver">Caregiver</Option>
                <Option value="patient">Patient</Option>
                <Option value="admin">Administrator</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                { pattern: /^\+?[\d\s-()]+$/, message: 'Please enter a valid phone number!' }
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Phone number (optional)"
                className="h-12"
              />
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
            >
              <DatePicker
                placeholder="Select date of birth (optional)"
                className="w-full h-12"
                format="YYYY-MM-DD"
              />
            </Form.Item>

            {/* Address Section */}
            <Title level={4} className="mt-8 mb-4">Address Information (Optional)</Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Item name={['address', 'street']} label="Street">
                <Input
                  prefix={<HomeOutlined className="text-gray-400" />}
                  placeholder="Street address"
                  className="h-12"
                />
              </Form.Item>
              <Form.Item name={['address', 'city']} label="City">
                <Input placeholder="City" className="h-12" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Form.Item name={['address', 'state']} label="State">
                <Input placeholder="State" className="h-12" />
              </Form.Item>
              <Form.Item name={['address', 'zipCode']} label="ZIP Code">
                <Input placeholder="ZIP Code" className="h-12" />
              </Form.Item>
              <Form.Item name={['address', 'country']} label="Country">
                <Input placeholder="Country" defaultValue="USA" className="h-12" />
              </Form.Item>
            </div>

            {/* Emergency Contact Section */}
            <Title level={4} className="mt-8 mb-4">Emergency Contact (Optional)</Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Item name={['emergencyContact', 'name']} label="Contact Name">
                <Input placeholder="Emergency contact name" className="h-12" />
              </Form.Item>
              <Form.Item name={['emergencyContact', 'relationship']} label="Relationship">
                <Input placeholder="Relationship to you" className="h-12" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Form.Item name={['emergencyContact', 'phoneNumber']} label="Contact Phone">
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="Emergency contact phone"
                  className="h-12"
                />
              </Form.Item>
              <Form.Item name={['emergencyContact', 'email']} label="Contact Email">
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Emergency contact email"
                  className="h-12"
                />
              </Form.Item>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <Text className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in here
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
