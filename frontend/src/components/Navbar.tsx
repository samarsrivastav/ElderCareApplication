import React, { useState } from 'react';
import { Layout, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;

/**
 * Navigation component with responsive design
 * @returns JSX.Element
 */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuClick = (key: string) => {
    navigate(key);
    setMobileMenuOpen(false);
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
      key: '/blog',
      label: 'Blog'
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
    <>
      <Header className="fixed w-full z-50 bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <button 
            className="flex items-center cursor-pointer bg-transparent border-none p-0"
            onClick={() => navigate('/')}
          >
            <img 
              src="/AGEVAA.jpeg" 
              alt="AGEVAA Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 mr-2 object-contain"
            />
            <span className="text-lg sm:text-xl font-semibold text-gray-800">
              AGEVAA
            </span>
          </button>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {publicMenuItems.map(item => (
              <button
                key={item.key}
                className={`cursor-pointer text-gray-600 hover:text-blue-600 transition-colors bg-transparent border-none p-0 ${
                  location.pathname === item.key ? 'text-blue-600 font-medium' : ''
                }`}
                onClick={() => handleMenuClick(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Contact Info - Hidden on small screens */}
          <div className="hidden lg:flex items-center space-x-4">
            <span className="text-gray-600 text-sm">
              Senior Living Solutions
            </span>
          </div>

          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden"
          />
        </div>
      </Header>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <div className="flex flex-col space-y-4">
          {publicMenuItems.map(item => (
            <button
              key={item.key}
              className={`cursor-pointer p-3 rounded-lg transition-colors text-left bg-transparent border-none ${
                location.pathname === item.key 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => handleMenuClick(item.key)}
            >
              {item.label}
            </button>
          ))}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <span className="text-gray-500 text-sm">
              Elder Care Services
            </span>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
