import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Space,
  Spin,
  Alert,
  List,
  Rate,
  Tabs,
  Badge,
  Modal,
  Carousel,
} from 'antd';
import ImageWithFallback from '../components/ImageWithFallback';
import ImageCollage from '../components/ImageCollage';
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { roomService } from '../services/roomService';
import { Room, RoomDetailsResponse } from '../types/room';
import { CURRENCY_SYMBOLS } from '../constants';
import RatingIndicator from '../components/RatingIndicator';
import RatingPieChart from '../components/RatingPieChart';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

/**
 * Room detail page with comprehensive information and ratings
 * @returns JSX.Element
 */
const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCarouselVisible, setIsCarouselVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchRoomDetails();
    }
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: RoomDetailsResponse = await roomService.getRoomById(id!);
      
      if (response.success) {
        setRoom(response.data.room);
      }
    } catch (err) {
      setError('Failed to fetch room details. Please try again.');
      console.error('Error fetching room details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number | undefined, currency: string) => {
    if (amount === undefined || amount === null) {
      return 'Price not available';
    }
    const symbol = CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getRoomTypeColor = (type: string) => {
    const colors = {
      assisted_living: 'blue',
      independent_living: 'green',
      memory_care: 'orange',
      daycare: 'purple',
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  /**
   * Handle image click to open carousel modal
   * @param index - Index of the clicked image
   */
  const handleImageClick = (index: number): void => {
    setCurrentImageIndex(index);
    setIsCarouselVisible(true);
  };

  /**
   * Close the carousel modal
   */
  const handleCloseCarousel = (): void => {
    setIsCarouselVisible(false);
  };


  const getCareLevelColor = (level: string) => {
    const colors = {
      high: 'red',
      medium: 'orange',
      low: 'green',
    };
    return colors[level as keyof typeof colors] || 'default';
  };

  const handleAddToCompare = () => {
    // This would typically add to a global compare list
    // For now, we'll navigate to compare page with this room
    navigate('/compare', { state: { roomIds: [id] } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert
          message="Error"
          description={error || 'Room not found'}
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate('/rooms')}>
              Back to Rooms
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/rooms')}
            className="mb-4"
          >
            Back to Rooms
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card className="shadow-sm">
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div>
                    <Title level={2} className="mb-2">
                      {room.name}
                    </Title>
                    <Text className="text-lg text-gray-600">
                      {room.facilityName}
                    </Text>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Rate
                      disabled
                      value={room.overallRating}
                      style={{ fontSize: 20 }}
                      className="text-yellow-400"
                    />
                    <Text className="text-lg font-semibold">
                      {room.overallRating.toFixed(1)}/10
                    </Text>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Tag color={getRoomTypeColor(room.roomType)} className="capitalize">
                    {room.roomType.replace('_', ' ')}
                  </Tag>
                  <Tag color={getCareLevelColor(room.careLevel)}>
                    {room.careLevel} care
                  </Tag>
                  <Tag color="blue">{room.occupancy}</Tag>
                  <Tag color="purple">{room.lengthOfStay} term</Tag>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <EnvironmentOutlined className="mr-2" />
                  <Text>{room.location.address}</Text>
                </div>
              </div>

              <div className="mb-6">
                <ImageCollage
                  images={room.images || []}
                  altPrefix={`${room.name} - Image`}
                  onViewMore={() => handleImageClick(0)}
                  onImageClick={handleImageClick}
                  height="400px"
                />
              </div>

              <Tabs defaultActiveKey="overview">
                <TabPane tab="Overview" key="overview">
                  <div className="space-y-6">
                    <div>
                      <Title level={4}>Description</Title>
                      <Paragraph>{room.description}</Paragraph>
                    </div>

                    <div>
                      <Title level={4}>Pricing Details</Title>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                          <Card size="small" className="text-center">
                            <div className="text-2xl font-bold text-primary-600">
                              {formatPrice(room.pricing.rent, room.pricing.currency)}
                            </div>
                            <div className="text-sm text-gray-500">Monthly Rent</div>
                          </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Card size="small" className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {formatPrice(room.pricing.securityDeposit, room.pricing.currency)}
                            </div>
                            <div className="text-sm text-gray-500">Security Deposit</div>
                          </Card>
                        </Col>
                        {room.pricing.admissionCharge && (
                          <Col xs={24} sm={12}>
                            <Card size="small" className="text-center">
                              <div className="text-2xl font-bold text-orange-600">
                                {formatPrice(room.pricing.admissionCharge, room.pricing.currency)}
                              </div>
                              <div className="text-sm text-gray-500">Admission Charge</div>
                            </Card>
                          </Col>
                        )}
                        <Col xs={24} sm={12}>
                          <Card size="small" className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {formatPrice(room.totalCost, room.pricing.currency)}
                            </div>
                            <div className="text-sm text-gray-500">Total Cost</div>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </TabPane>

                <TabPane tab="Services & Amenities" key="services">
                  <div className="space-y-6">
                    <div>
                      <Title level={4}>Medical Services</Title>
                      <List
                        dataSource={room.medicalServices}
                        renderItem={(item) => (
                          <List.Item>
                            <Badge color="blue" />
                            <span className="ml-2">{item}</span>
                          </List.Item>
                        )}
                      />
                    </div>

                    <div>
                      <Title level={4}>Lifestyle Amenities</Title>
                      <List
                        dataSource={room.lifestyle.amenities}
                        renderItem={(item) => (
                          <List.Item>
                            <Badge color="green" />
                            <span className="ml-2">{item}</span>
                          </List.Item>
                        )}
                      />
                    </div>

                    <div>
                      <Title level={4}>Facilities</Title>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                          <Card size="small" title="Shared Spaces">
                            <List
                              size="small"
                              dataSource={room.facilities.sharedSpaces}
                              renderItem={(item) => <List.Item>{item}</List.Item>}
                            />
                          </Card>
                        </Col>
                        <Col xs={24} md={8}>
                          <Card size="small" title="Safety Features">
                            <List
                              size="small"
                              dataSource={room.facilities.safetyFeatures}
                              renderItem={(item) => <List.Item>{item}</List.Item>}
                            />
                          </Card>
                        </Col>
                        <Col xs={24} md={8}>
                          <Card size="small" title="Accessibility">
                            <List
                              size="small"
                              dataSource={room.facilities.accessibility}
                              renderItem={(item) => <List.Item>{item}</List.Item>}
                            />
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </TabPane>

                <TabPane tab="Contact" key="contact">
                  <div className="space-y-4">
                    {room.contactInfo.phone && (
                      <div className="flex items-center space-x-3">
                        <PhoneOutlined className="text-primary-500" />
                        <Text>{room.contactInfo.phone}</Text>
                      </div>
                    )}
                    {room.contactInfo.email && (
                      <div className="flex items-center space-x-3">
                        <MailOutlined className="text-primary-500" />
                        <Text>{room.contactInfo.email}</Text>
                      </div>
                    )}
                    {room.contactInfo.website && (
                      <div className="flex items-center space-x-3">
                        <GlobalOutlined className="text-primary-500" />
                        <a
                          href={room.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          {room.contactInfo.website}
                        </a>
                      </div>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <div className="space-y-6">
              <Card className="shadow-sm">
                <Title level={4} className="mb-4">
                  Overall Rating
                </Title>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {room.overallRating.toFixed(1)}
                  </div>
                  <Rate
                    disabled
                    value={room.overallRating}
                    style={{ fontSize: 24 }}
                    className="text-yellow-400"
                  />
                  <Text className="block text-gray-500 mt-2">out of 10</Text>
                </div>
              </Card>

              <RatingPieChart ratings={{
                lifestyle: room.lifestyle.rating,
                medical: room.medical.rating,
                services: room.services.rating,
                community: room.community.rating,
              }} />

              <Card className="shadow-sm">
                <Title level={4} className="mb-4">
                  Detailed Ratings
                </Title>
                <div className="space-y-4">
                  <RatingIndicator
                    rating={room.lifestyle.rating}
                    label="Lifestyle"
                    showStars
                  />
                  <RatingIndicator
                    rating={room.medical.rating}
                    label="Medical Care"
                    showStars
                  />
                  <RatingIndicator
                    rating={room.services.rating}
                    label="Services"
                    showStars
                  />
                  <RatingIndicator
                    rating={room.community.rating}
                    label="Community"
                    showStars
                  />
                </div>
              </Card>

              <Card className="shadow-sm">
                <Space direction="vertical" className="w-full">
                  <Button
                    type="primary"
                    size="large"
                    icon={<PhoneOutlined />}
                    className="w-full"
                    href={`tel:${room.contactInfo.phone}`}
                  >
                    Contact Now
                  </Button>
                  <Button
                    size="large"
                    icon={<SwapOutlined />}
                    onClick={handleAddToCompare}
                    className="w-full"
                  >
                    Add to Compare
                  </Button>
                </Space>

                {/* Payment Buttons */}
                {room.totalCost && room.pricing.rent && (
                  <div className="mt-6 space-y-3">
                    <Button
                      type="primary"
                      size="large"
                      className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 border-green-600"
                      onClick={() => navigate(`/payment?roomId=${room.id}&type=buy&amount=${room.totalCost}`)}
                    >
                      🏠 Buy Now - {formatPrice(room.totalCost, room.pricing.currency)}
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 border-blue-600"
                      onClick={() => navigate(`/payment?roomId=${room.id}&type=rent&amount=${room.pricing.rent}`)}
                    >
                      📅 Rent Monthly - {formatPrice(room.pricing.rent, room.pricing.currency)}/month
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      {/* Image Carousel Modal */}
      <Modal
        title={`${room?.name} - Images`}
        open={isCarouselVisible}
        onCancel={handleCloseCarousel}
        footer={null}
        width="90vw"
        style={{ maxWidth: '1200px' }}
        centered
        className="image-carousel-modal"
      >
        {room?.images && room.images.length > 0 && (
          <Carousel
            initialSlide={currentImageIndex}
            dots={true}
            infinite={room.images.length > 1}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            adaptiveHeight={true}
            arrows={true}
            className="image-carousel"
          >
            {room.images.map((image, index) => (
              <div key={`carousel-${room.id}-${image.slice(-10)}-${index}`}>
                <div className="flex justify-center items-center min-h-[400px] max-h-[70vh]">
                  <ImageWithFallback
                    src={image}
                    alt={`${room.name} - Image ${index + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
                <div className="text-center mt-4 text-gray-600">
                  Image {index + 1} of {room.images.length}
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </Modal>
    </div>
  );
};

export default RoomDetailPage;
