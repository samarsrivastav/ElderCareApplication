import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const { Header } = Layout;

/**
 * Navigation component with authentication and responsive design
 * @returns JSX.Element
 */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const publicMenuItems = [
    {
      key: '/',
      label: 'Home'
    },
    {
      key: '/about',
      label: 'About'
    },
    {
      key: '/services',
      label: 'Services'
    },
    {
      key: '/contact',
      label: 'Contact'
    }
  ];

  return (
    <Header className="fixed w-full z-50 bg-white shadow-sm border-b border-gray-200 px-6">
      <div className="flex items-center justify-between h-full">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="text-2xl font-bold text-blue-600 mr-2">
            🏥
          </div>
          <span className="text-xl font-semibold text-gray-800">
            ElderCare
          </span>
        </div>

        {/* Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {publicMenuItems.map(item => (
            <span
              key={item.key}
              className={`cursor-pointer text-gray-600 hover:text-blue-600 transition-colors ${
                location.pathname === item.key ? 'text-blue-600 font-medium' : ''
              }`}
              onClick={() => handleMenuClick(item.key)}
            >
              {item.label}
            </span>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <Avatar 
                  icon={<UserOutlined />} 
                  className="bg-blue-600"
                />
                <span className="text-gray-700 font-medium">
                  {user?.firstName || 'User'}
                </span>
              </div>
            </Dropdown>
          ) : (
            <>
              <Button 
                type="text" 
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-blue-600"
              >
                Login
              </Button>
              <Button 
                type="primary" 
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
