import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import ComparePage from './pages/ComparePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PaymentPage from './pages/PaymentPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';

const { Content } = Layout;

/**
 * Main App component with routing and layout
 * @returns JSX.Element
 */
const App: React.FC = () => {
  return (
    <Routes>
      {/* Admin routes without navbar */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      
      {/* Public routes with navbar */}
      <Route path="/*" element={
        <Layout className="min-h-screen">
          <Navbar />
          <Content className="pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:id" element={<RoomDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/payment" element={<PaymentPage />} />
            </Routes>
          </Content>
        </Layout>
      } />
    </Routes>
  );
};

export default App;
