import React from 'react';
import { Card, Rate, Tag, Button, Row, Col } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, EyeOutlined, SwapOutlined } from '@ant-design/icons';
import { Room } from '../types/room';
import { CURRENCY_SYMBOLS } from '../constants';

interface RoomCardProps {
  room: Room;
  onViewDetails: (roomId: string) => void;
  onAddToCompare: (roomId: string) => void;
  isInCompareList?: boolean;
  className?: string;
}

/**
 * Room card component for displaying room information in a grid
 * @param props - Component props
 * @returns JSX.Element
 */
const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onViewDetails,
  onAddToCompare,
  isInCompareList = false,
  className = '',
}) => {
  const formatPrice = (amount: number | undefined, currency: string) => {
    if (!amount) return 'N/A';
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

  const getCareLevelColor = (level: string) => {
    const colors = {
      high: 'red',
      medium: 'orange',
      low: 'green',
    };
    return colors[level as keyof typeof colors] || 'default';
  };

  return (
    <Card
      hoverable
      className={`h-full ${className}`}
      cover={
        <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
          {room.images && room.images.length > 0 ? (
            <img
              alt={room.name}
              src={room.images[0]}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-4 right-4">
            <Tag color={getRoomTypeColor(room.roomType)} className="capitalize">
              {room.roomType.replace('_', ' ')}
            </Tag>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center space-x-2">
              <Rate
                disabled
                value={room.overallRating}
                style={{ fontSize: 14 }}
                className="text-yellow-400"
              />
              <span className="text-sm font-medium">
                {room.overallRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      }
      actions={[
        <Button
          key="view"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => onViewDetails(room.id)}
          className="w-full"
        >
          View Details
        </Button>,
        <Button
          key="compare"
          icon={<SwapOutlined />}
          onClick={() => onAddToCompare(room.id)}
          disabled={isInCompareList}
          className="w-full"
        >
          {isInCompareList ? 'Added' : 'Compare'}
        </Button>,
      ]}
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {room.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{room.facilityName}</p>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <EnvironmentOutlined className="mr-1" />
          <span>{room.location.area}, {room.location.city}</span>
        </div>

        <Row gutter={[8, 8]}>
          <Col span={12}>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-primary-600">
                {formatPrice(room.pricing.rent, room.pricing.currency)}
              </div>
              <div className="text-xs text-gray-500">Monthly Rent</div>
            </div>
          </Col>
          <Col span={12}>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-green-600">
                {formatPrice(room.totalCost, room.pricing.currency)}
              </div>
              <div className="text-xs text-gray-500">Total Cost</div>
            </div>
          </Col>
        </Row>

        <div className="flex flex-wrap gap-1">
          <Tag color={getCareLevelColor(room.careLevel)}>
            {room.careLevel} care
          </Tag>
          <Tag color="blue">
            {room.occupancy}
          </Tag>
          <Tag color="purple">
            {room.lengthOfStay} term
          </Tag>
        </div>

        {room.contactInfo?.phone && (
          <div className="flex items-center text-sm text-gray-500">
            <PhoneOutlined className="mr-1" />
            <span>{room.contactInfo.phone}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RoomCard;
