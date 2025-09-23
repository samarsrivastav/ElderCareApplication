import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, Alert, Spin, message, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { roomService } from '../services/roomService';
import { Room } from '../types/room';

const { Title, Text } = Typography;

/**
 * Payment form data interface
 */
interface EnquiryFormData {
  name: string;
  phone: string;
  email: string;
  message?: string;
}

/**
 * Payment page component for processing room purchases and rentals
 * @returns JSX.Element
 */
const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const roomId = searchParams.get('roomId');
  const paymentType = searchParams.get('type'); // 'buy' or 'rent'
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    } else {
      navigate('/rooms');
    }
  }, [roomId]);

  /**
   * Fetch room details
   */
  const fetchRoomDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await roomService.getRoomById(roomId!);
      if (response.success) {
        setRoom(response.data.room);
      } else {
        throw new Error('Failed to fetch room details');
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      message.error('Failed to load room details');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (values: EnquiryFormData): Promise<void> => {
    try {
      setSubmitting(true);
      
      // Store as enquiry in Payments collection via payment endpoint (no transactionId)
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5001/api') + '/payments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: roomId!,
          roomName: room?.name || '',
          paymentType: paymentType! as 'buy' | 'rent',
          amount: parseFloat(amount!),
          currency: room?.pricing?.currency || 'INR',
          customerName: values.name,
          customerPhone: values.phone,
          customerEmail: values.email,
        }),
      });
      const result = await res.json();

      if (result.success) {
        message.success('Enquiry submitted successfully! We will contact you shortly.');
        navigate('/rooms');
      } else {
        throw new Error(result.message || 'Failed to submit enquiry');
      }
      
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      message.error('Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Copy UPI ID to clipboard
   */
  // No copy needed for enquiry mode

  /**
   * Format price with currency
   */
  const formatPrice = (price: number, currency: string): string => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
    };
    const symbol = symbols[currency] || currency;
    return `${symbol}${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!room || !paymentType || !amount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert
          message="Invalid Enquiry"
          description="Missing required information."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            Back to Room Details
          </Button>
          <Title level={2} className="mb-2">
            {paymentType === 'buy' ? 'Buy' : 'Rent'} Enquiry
          </Title>
          <Text type="secondary">
            Share your contact details and we will reach out for {room.name}
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Enquiry Form */}
          <Col xs={24} lg={14}>
            <Card title="Your Details" className="mb-6">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { required: true, message: 'Please enter your full name' },
                    { min: 2, message: 'Name must be at least 2 characters' },
                  ]}
                >
                  <Input size="large" placeholder="Enter your full name" />
                </Form.Item>

                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[
                    { required: true, message: 'Please enter your phone number' },
                    { pattern: /^[+]?[1-9]\d{9,14}$/, message: 'Please enter a valid phone number' },
                  ]}
                >
                  <Input size="large" placeholder="Enter your phone number" />
                </Form.Item>

                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email address' },
                    { type: 'email', message: 'Please enter a valid email address' },
                  ]}
                >
                  <Input size="large" placeholder="Enter your email address" />
                </Form.Item>

                <Form.Item label="Message (optional)" name="message">
                  <Input.TextArea rows={4} placeholder="Tell us anything we should know" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={submitting}
                    className="w-full h-12 text-lg font-semibold"
                  >
                    {submitting ? 'Submitting...' : 'Submit Enquiry'}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Room Summary */}
          <Col xs={24} lg={10}>
            {/* Order Summary */}
            <Card title="Order Summary" className="mb-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Text strong>Room:</Text>
                  <Text>{room.name}</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text strong>Type:</Text>
                  <Text className="capitalize">{paymentType}</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text strong>Amount:</Text>
                  <Text strong className="text-lg text-blue-600">
                    {formatPrice(parseFloat(amount), room.pricing?.currency || 'INR')}
                    {paymentType === 'rent' && '/month'}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PaymentPage;
