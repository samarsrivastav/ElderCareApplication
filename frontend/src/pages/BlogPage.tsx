import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Spin,
  Alert,
  Tag,
  Pagination,
  Input,
} from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { blogService } from '../services/blogService';
import { Blog } from '../types/blog';
import ImageWithFallback from '../components/ImageWithFallback';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

/**
 * Blog listing page component
 * @returns JSX.Element
 */
const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogService.getAllBlogs(currentPage, 9, true);
      
      if (response.success && response.data.blogs) {
        setBlogs(response.data.blogs);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }
      }
    } catch (err) {
      setError('Failed to fetch blogs. Please try again.');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string): void => {
    setSearchTerm(value);
    // Filter blogs based on search term
    if (value.trim()) {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(value.toLowerCase()) ||
        blog.description.toLowerCase().includes(value.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
      );
      setBlogs(filtered);
    } else {
      fetchBlogs();
    }
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBlogClick = (blog: Blog): void => {
    navigate(`/blog/${blog.slug}`);
  };

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
            <Button onClick={fetchBlogs}>
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            AGEVAA Blog
          </Title>
          <Paragraph className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover insights, tips, and stories about senior living and elder care
          </Paragraph>
          
          {/* Search */}
          <div className="max-w-md mx-auto">
            <Search
              placeholder="Search blogs..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <Title level={3} className="text-gray-500">
              {searchTerm ? 'No blogs found matching your search' : 'No blogs available yet'}
            </Title>
            <Paragraph className="text-gray-400">
              {searchTerm ? 'Try a different search term' : 'Check back later for new content'}
            </Paragraph>
          </div>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {blogs.map((blog) => (
                <Col xs={24} sm={12} lg={8} key={blog._id}>
                  <Card
                    hoverable
                    className="h-full shadow-sm hover:shadow-lg transition-shadow duration-300"
                    cover={
                      <div className="h-48 overflow-hidden">
                        <ImageWithFallback
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    }
                    onClick={() => handleBlogClick(blog)}
                  >
                    <div className="space-y-3">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <Tag key={index} color="blue" className="text-xs">
                            {tag}
                          </Tag>
                        ))}
                        {blog.tags.length > 3 && (
                          <Tag color="default" className="text-xs">
                            +{blog.tags.length - 3} more
                          </Tag>
                        )}
                      </div>

                      {/* Title */}
                      <Title level={4} className="mb-2 line-clamp-2">
                        {blog.title}
                      </Title>

                      {/* Description */}
                      <Paragraph className="text-gray-600 line-clamp-3 mb-4">
                        {blog.description}
                      </Paragraph>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <Space>
                          <UserOutlined />
                          <Text>{blog.authorName}</Text>
                        </Space>
                        <Space>
                          <CalendarOutlined />
                          <Text>{formatDate(blog.createdAt)}</Text>
                        </Space>
                      </div>

                      {/* Views */}
                      <div className="flex items-center text-sm text-gray-500">
                        <EyeOutlined className="mr-1" />
                        <Text>{blog.views} views</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <Pagination
                  current={currentPage}
                  total={totalPages * 9} // Assuming 9 items per page
                  pageSize={9}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
