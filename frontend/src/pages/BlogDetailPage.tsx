import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Button,
  Space,
  Spin,
  Alert,
  Tag,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { blogService } from '../services/blogService';
import { Blog } from '../types/blog';
import ImageWithFallback from '../components/ImageWithFallback';

const { Title, Text, Paragraph } = Typography;

/**
 * Blog detail page component
 * @returns JSX.Element
 */
const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogService.getBlogBySlug(slug!);
      
      if (response.success && response.data.blog) {
        setBlog(response.data.blog);
      } else {
        setError('Blog not found');
      }
    } catch (err) {
      setError('Failed to fetch blog. Please try again.');
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert
          message="Error"
          description={error || 'Blog not found'}
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate('/blog')}>
              Back to Blog
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/blog')}
            className="mb-4"
          >
            Back to Blog
          </Button>
        </div>

        <Card className="shadow-sm">
          {/* Blog Image */}
          <div className="mb-8">
            <ImageWithFallback
              src={blog.image}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Blog Content */}
          <div className="space-y-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <Tag key={index} color="blue">
                  {tag}
                </Tag>
              ))}
            </div>

            {/* Title */}
            <Title level={1} className="text-3xl md:text-4xl font-bold text-gray-800">
              {blog.title}
            </Title>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <Space>
                <UserOutlined />
                <Text strong>{blog.authorName}</Text>
              </Space>
              <Space>
                <CalendarOutlined />
                <Text>{formatDate(blog.createdAt)}</Text>
              </Space>
              <Space>
                <EyeOutlined />
                <Text>{blog.views} views</Text>
              </Space>
            </div>

            <Divider />

            {/* Description */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <Title level={4} className="text-blue-800 mb-3">
                Overview
              </Title>
              <Paragraph className="text-lg text-blue-700">
                {blog.description}
              </Paragraph>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: blog.content.replace(/\n/g, '<br>') 
                }}
                className="text-gray-700 leading-relaxed"
              />
            </div>

            {/* Author Info */}
            <Card className="bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-white text-xl" />
                </div>
                <div>
                  <Title level={5} className="mb-1">
                    {blog.authorName}
                  </Title>
                  <Text type="secondary">
                    AGEVAA Team Member
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetailPage;
