import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Spin,
  Alert,
  Tabs,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Statistic,
  Checkbox,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
  MailOutlined,
  EyeOutlined,
  UploadOutlined,
  CheckOutlined,
  FileTextOutlined,
  ContactsOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { adminService } from '../services/adminService';
import { blogService } from '../services/blogService';
import { Blog, CreateBlogData, Admin } from '../types/blog';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

/**
 * Admin dashboard page component
 * @returns JSX.Element
 */
const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Blog states
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogLoading] = useState(false);
  const [blogModalVisible, setBlogModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogForm] = Form.useForm();
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Contact states
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactLoading] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  
  // Stats states
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (admin) {
      fetchDashboardData();
    }
  }, [admin]);

  const checkAuth = async (): Promise<void> => {
    if (!adminService.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    try {
      const response = await adminService.getProfile();
      if (response.success && response.data.admin) {
        setAdmin(response.data.admin);
      } else {
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [statsResponse, blogsResponse, contactsResponse] = await Promise.all([
        adminService.getDashboardStats(),
        blogService.getAdminBlogs(1, 10),
        adminService.getContacts(1, 5)
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      if (blogsResponse.success && blogsResponse.data.blogs) {
        setBlogs(blogsResponse.data.blogs);
      }
      if (contactsResponse.success && contactsResponse.data.contacts) {
        setContacts(contactsResponse.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (): void => {
    adminService.logout();
    navigate('/admin/login');
  };

  const handleCreateBlog = (): void => {
    setEditingBlog(null);
    blogForm.resetFields();
    setImagePreview('');
    setBlogModalVisible(true);
  };

  const handleImageUpload = (file: File): string => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    return '';
  };

  const handlePreviewBlog = (blog: Blog): void => {
    setPreviewBlog(blog);
    setPreviewModalVisible(true);
  };

  const handleViewContact = (contact: any): void => {
    setSelectedContact(contact);
    setContactModalVisible(true);
  };

  const handlePublishBlog = async (blogId: string): Promise<void> => {
    try {
      await blogService.updateBlog(blogId, { published: true });
      message.success('Blog published successfully');
      fetchDashboardData();
    } catch (error) {
      message.error('Failed to publish blog');
    }
  };

  const handleEditBlog = (blog: Blog): void => {
    setEditingBlog(blog);
    setImagePreview(blog.image);
    blogForm.setFieldsValue({
      title: blog.title,
      description: blog.description,
      content: blog.content,
      tags: blog.tags.join(', '),
      published: blog.published,
    });
    setBlogModalVisible(true);
  };

  const handleDeleteBlog = async (blogId: string): Promise<void> => {
    try {
      await blogService.deleteBlog(blogId);
      message.success('Blog deleted successfully');
      fetchDashboardData();
    } catch (error) {
      message.error('Failed to delete blog');
    }
  };

  const handleBlogSubmit = async (values: any): Promise<void> => {
    try {
      const blogData: CreateBlogData = {
        title: values.title,
        description: values.description,
        content: values.content,
        image: imagePreview || 'https://via.placeholder.com/800x400?text=Blog+Image',
        tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : [],
        published: values.published || false,
      };

      if (editingBlog) {
        await blogService.updateBlog(editingBlog._id, blogData);
        message.success('Blog updated successfully');
      } else {
        await blogService.createBlog(blogData);
        message.success('Blog created successfully');
      }

      setBlogModalVisible(false);
      setImagePreview('');
      fetchDashboardData();
    } catch (error) {
      message.error('Failed to save blog');
    }
  };

  const blogColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Text className="line-clamp-1" style={{ maxWidth: 200 }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'published',
      key: 'published',
      render: (published: boolean) => (
        <Tag color={published ? 'green' : 'orange'}>
          {published ? 'Published' : 'Draft'}
        </Tag>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Blog) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handlePreviewBlog(record)}
            title="Preview"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditBlog(record)}
            title="Edit"
          />
          {!record.published && (
            <Button
              type="text"
              icon={<CheckOutlined />}
              onClick={() => handlePublishBlog(record._id)}
              title="Publish"
              style={{ color: '#52c41a' }}
            />
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBlog(record._id)}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  const contactColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Button type="link" onClick={() => handleViewContact(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button onClick={fetchDashboardData}>
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-sm px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/AGEVAA.jpeg" 
              alt="AGEVAA Logo" 
              className="h-8 w-8 object-contain"
            />
            <Title level={4} className="mb-0">
              AGEVAA Admin Dashboard
            </Title>
          </div>
          <Space>
            <Text>Welcome, {admin?.name}</Text>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Space>
        </div>
      </Header>

      <Content className="p-6">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: 'dashboard',
              label: 'Dashboard',
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title="Total Contacts"
                        value={stats?.contacts?.total || 0}
                        prefix={<ContactsOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title="Recent Contacts"
                        value={stats?.contacts?.recent || 0}
                        prefix={<MailOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title="Total Blogs"
                        value={stats?.blogs?.total || 0}
                        prefix={<BookOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title="Published Blogs"
                        value={stats?.blogs?.published || 0}
                        prefix={<FileTextOutlined />}
                      />
                    </Card>
                  </Col>
                </Row>
              )
            },
            {
              key: 'blogs',
              label: 'Blog Management',
              children: (
                <>
                  <div className="mb-4">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleCreateBlog}
                    >
                      Create New Blog
                    </Button>
                  </div>
                  <Table
                    columns={blogColumns}
                    dataSource={blogs}
                    rowKey="_id"
                    loading={blogLoading}
                    pagination={false}
                  />
                </>
              )
            },
            {
              key: 'contacts',
              label: 'Contact Management',
              children: (
                <Table
                  columns={contactColumns}
                  dataSource={contacts}
                  rowKey="_id"
                  loading={contactLoading}
                  pagination={false}
                />
              )
            }
          ]}
        />
      </Content>

      {/* Blog Modal */}
      <Modal
        title={editingBlog ? 'Edit Blog' : 'Create New Blog'}
        open={blogModalVisible}
        onCancel={() => setBlogModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={blogForm}
          layout="vertical"
          onFinish={handleBlogSubmit}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter blog title' }]}
          >
            <Input placeholder="Enter blog title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter blog description' }]}
          >
            <TextArea
              rows={3}
              placeholder="Enter blog description"
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter blog content' }]}
          >
            <TextArea
              rows={8}
              placeholder="Enter blog content"
            />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags (comma-separated)"
          >
            <Input placeholder="Enter tags separated by commas" />
          </Form.Item>

          <Form.Item
            label="Blog Image"
          >
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-20 object-cover rounded"
                />
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="published"
            valuePropName="checked"
          >
            <Checkbox>Publish immediately</Checkbox>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingBlog ? 'Update Blog' : 'Create Blog'}
              </Button>
              <Button onClick={() => setBlogModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Blog Preview Modal */}
      <Modal
        title="Blog Preview"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={null}
        width={800}
      >
        {previewBlog && (
          <div>
            <img 
              src={previewBlog.image} 
              alt={previewBlog.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <Title level={3}>{previewBlog.title}</Title>
            <Text type="secondary" className="block mb-4">
              By {previewBlog.authorName} • {new Date(previewBlog.createdAt).toLocaleDateString()}
            </Text>
            <div className="mb-4">
              {previewBlog.tags.map((tag, index) => (
                <Tag key={index} color="blue" className="mb-1">
                  {tag}
                </Tag>
              ))}
            </div>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <Text strong>Description:</Text>
              <p className="mt-2">{previewBlog.description}</p>
            </div>
            <div>
              <Text strong>Content:</Text>
              <div 
                className="mt-2 prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: previewBlog.content.replace(/\n/g, '<br>') 
                }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Contact Details Modal */}
      <Modal
        title="Contact Details"
        open={contactModalVisible}
        onCancel={() => setContactModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedContact && (
          <div className="space-y-4">
            <div>
              <Text strong>Name:</Text>
              <p className="mt-1">{selectedContact.name}</p>
            </div>
            <div>
              <Text strong>Email:</Text>
              <p className="mt-1">{selectedContact.email}</p>
            </div>
            {selectedContact.phone && (
              <div>
                <Text strong>Phone:</Text>
                <p className="mt-1">{selectedContact.phone}</p>
              </div>
            )}
            <div>
              <Text strong>Subject:</Text>
              <p className="mt-1">{selectedContact.subject}</p>
            </div>
            <div>
              <Text strong>Message:</Text>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                <p className="whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
            </div>
            <div>
              <Text strong>Date:</Text>
              <p className="mt-1">{new Date(selectedContact.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default AdminPage;
