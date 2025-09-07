import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Alert,
  Upload,
  Image,
  Spin,
  message,
  Row,
  Col,
} from 'antd';
import {
  ArrowLeftOutlined,
  UploadOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { roomService } from '../services/roomService';
import { paymentService } from '../services/paymentService';
import { Room } from '../types/room';

const { Title, Text, Paragraph } = Typography;

/**
 * Payment form data interface
 */
interface PaymentFormData {
  name: string;
  phone: string;
  email: string;
  transactionId: string;
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

  // UPI ID for payments
  const UPI_ID = 'eldercare@paytm';
  const UPI_QR_CODE = '/upi-qr-code.svg';

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
  const handleSubmit = async (values: PaymentFormData): Promise<void> => {
    try {
      setSubmitting(true);
      
      const paymentData = {
        roomId: roomId!,
        roomName: room?.name || '',
        paymentType: paymentType! as 'buy' | 'rent',
        amount: parseFloat(amount!),
        currency: room?.pricing?.currency || 'INR',
        customerName: values.name,
        customerPhone: values.phone,
        customerEmail: values.email,
        transactionId: values.transactionId,
      };

      // Submit to backend
      const result = await paymentService.submitPayment(paymentData);
      
      if (result.success) {
        message.success(result.message || 'Payment details submitted successfully! We will contact you shortly.');
        navigate('/rooms');
      } else {
        throw new Error(result.message || 'Failed to submit payment details');
      }
      
    } catch (error) {
      console.error('Error submitting payment:', error);
      message.error('Failed to submit payment details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Copy UPI ID to clipboard
   */
  const copyUpiId = (): void => {
    navigator.clipboard.writeText(UPI_ID);
    message.success('UPI ID copied to clipboard!');
  };

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
          message="Invalid Payment Request"
          description="Missing required payment information."
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
            Complete Your {paymentType === 'buy' ? 'Purchase' : 'Rental'} Payment
          </Title>
          <Text type="secondary">
            Secure your booking for {room.name}
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Payment Form */}
          <Col xs={24} lg={14}>
            <Card title="Payment Details" className="mb-6">
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

                <Form.Item
                  label="Transaction ID"
                  name="transactionId"
                  rules={[
                    { required: true, message: 'Please enter the transaction ID' },
                    { min: 6, message: 'Transaction ID must be at least 6 characters' },
                  ]}
                >
                  <Input size="large" placeholder="Enter UPI transaction ID" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={submitting}
                    className="w-full h-12 text-lg font-semibold"
                  >
                    {submitting ? 'Processing...' : 'Submit Payment Details'}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Payment Information */}
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
                  <Text strong className="text-lg text-green-600">
                    {formatPrice(parseFloat(amount), room.pricing?.currency || 'INR')}
                    {paymentType === 'rent' && '/month'}
                  </Text>
                </div>
              </div>
            </Card>

            {/* UPI Payment Instructions */}
            <Card title="Payment Instructions" className="mb-6">
              <Space direction="vertical" size="middle" className="w-full">
                <Alert
                  message="Complete Payment First"
                  description="Please complete the UPI payment before submitting this form."
                  type="info"
                  showIcon
                />

                <div>
                  <Text strong>Step 1: Pay via UPI</Text>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Text>UPI ID: </Text>
                      <div className="flex items-center gap-2">
                        <Text code className="text-sm">{UPI_ID}</Text>
                        <Button
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={copyUpiId}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    <Text type="secondary" className="text-xs">
                      Or scan the QR code below
                    </Text>
                  </div>
                </div>

                <div className="text-center">
                  <Text strong>QR Code for Payment</Text>
                  <div className="mt-2 p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <Image
                      src={UPI_QR_CODE}
                      alt="UPI QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                      preview={false}
                    />
                    <Text type="secondary" className="text-xs mt-2 block">
                      Scan with any UPI app to pay {formatPrice(parseFloat(amount), room.pricing?.currency || 'INR')}
                    </Text>
                  </div>
                </div>

                <div>
                  <Text strong>Step 2: Submit Form</Text>
                  <Paragraph type="secondary" className="text-sm mt-1">
                    After completing the payment, enter your transaction ID in the form and submit.
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PaymentPage;
