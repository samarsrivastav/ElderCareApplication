import React from 'react';
import { Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;

/**
 * Navigation component with responsive design
 * @returns JSX.Element
 */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const publicMenuItems = [
    {
      key: '/',
      label: 'Home'
    },
    {
      key: '/rooms',
      label: 'Find Rooms'
    },
    {
      key: '/compare',
      label: 'Compare'
    },
    {
      key: '/about',
      label: 'About'
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
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          role="button"
          tabIndex={0}
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
              onKeyDown={(e) => e.key === 'Enter' && handleMenuClick(item.key)}
              role="button"
              tabIndex={0}
            >
              {item.label}
            </span>
          ))}
        </div>

        {/* Contact Info */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 text-sm">
            Elder Care Services
          </span>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
