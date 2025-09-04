import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Table, Tag, Divider } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Room } from '../../types/room';
import { 
  formatPrice, 
  getRoomTypeColor, 
  getCareLevelColor, 
  prepareChartData,
  createComparisonColumns,
  createComparisonTableData
} from '../../utils/compare';
import ComparisonChart from '../ComparisonChart';
import RatingIndicator from '../RatingIndicator';

const { Title, Text } = Typography;

interface ComparisonResultsProps {
  rooms: Room[];
  comparisonSummary: any;
  onBackToRooms: () => void;
  onAddMoreRooms: () => void;
  onRemoveRoom: (roomId: string) => void;
  onViewRoomDetails: (roomId: string) => void;
}

/**
 * Comparison results component showing detailed comparison of selected rooms
 * @param props - Component props
 * @returns JSX.Element
 */
const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  rooms,
  comparisonSummary,
  onBackToRooms,
  onAddMoreRooms,
  onRemoveRoom,
  onViewRoomDetails,
}) => {
  const comparisonColumns = createComparisonColumns(rooms).map(column => {
    if (column.dataIndex === 'feature') {
      return column;
    }
    return {
      ...column,
      render: (value: any) => {
        if (typeof value === 'number') {
          return <span className="font-semibold">{value.toFixed(1)}</span>;
        }
        if (Array.isArray(value)) {
          return (
            <div className="max-h-32 overflow-y-auto">
              {value.map((item, index) => (
                <span 
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                >
                  {item}
                </span>
              ))}
            </div>
          );
        }
        return <span>{value}</span>;
      },
    };
  });
  const comparisonTableData = createComparisonTableData(rooms);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={onBackToRooms}
                className="mb-4"
              >
                Back to Rooms
              </Button>
              <Title level={2} className="mb-2">
                Room Comparison
              </Title>
              <Text className="text-gray-600">
                Compare {rooms.length} rooms side by side
              </Text>
            </div>
            
            <Space>
              <Button
                icon={<PlusOutlined />}
                onClick={onAddMoreRooms}
              >
                Add More Rooms
              </Button>
            </Space>
          </div>
        </div>

        <div className="space-y-8">
          {/* Room Cards */}
          <Row gutter={[24, 24]}>
            {rooms.map((room) => (
              <Col key={room.id} xs={24} lg={12} xl={8}>
                <Card
                  className="h-full"
                  title={
                    <div className="flex items-center justify-between">
                      <span className="truncate">{room.name}</span>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onRemoveRoom(room.id)}
                        size="small"
                      />
                    </div>
                  }
                  extra={
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => onViewRoomDetails(room.id)}
                    >
                      View Details
                    </Button>
                  }
                >
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600 mb-1">
                        {room.overallRating.toFixed(1)}/10
                      </div>
                      <Text className="text-gray-500">Overall Rating</Text>
                    </div>

                    <div className="space-y-2">
                      <RatingIndicator
                        rating={room.lifestyle.rating}
                        label="Lifestyle"
                        size="small"
                      />
                      <RatingIndicator
                        rating={room.medical.rating}
                        label="Medical"
                        size="small"
                      />
                      <RatingIndicator
                        rating={room.services.rating}
                        label="Services"
                        size="small"
                      />
                      <RatingIndicator
                        rating={room.community.rating}
                        label="Community"
                        size="small"
                      />
                    </div>

                    <Divider />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Text className="text-gray-600">Monthly Rent:</Text>
                        <Text className="font-semibold">
                          {formatPrice(room.pricing.rent, room.pricing.currency)}
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-gray-600">Total Cost:</Text>
                        <Text className="font-semibold">
                          {formatPrice(room.totalCost, room.pricing.currency)}
                        </Text>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Tag color={getRoomTypeColor(room.roomType)}>
                        {room.roomType.replace('_', ' ')}
                      </Tag>
                      <Tag color={getCareLevelColor(room.careLevel)}>
                        {room.careLevel} care
                      </Tag>
                      <Tag color="blue">
                        {room.occupancy}
                      </Tag>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Comparison Chart */}
          {rooms.length >= 2 && (
            <ComparisonChart data={prepareChartData(rooms)} />
          )}

          {/* Detailed Comparison Table */}
          <Card title="Detailed Comparison" className="shadow-sm">
            <Table
              columns={comparisonColumns}
              dataSource={comparisonTableData}
              pagination={false}
              scroll={{ x: 800 }}
              size="small"
            />
          </Card>

          {/* Summary Statistics */}
          {comparisonSummary && (
            <Card title="Summary Statistics" className="shadow-sm">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {comparisonSummary.priceRange.min.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Min Price (₹)</div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {comparisonSummary.priceRange.average.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Avg Price (₹)</div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {comparisonSummary.priceRange.max.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Max Price (₹)</div>
                  </div>
                </Col>
              </Row>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonResults;
