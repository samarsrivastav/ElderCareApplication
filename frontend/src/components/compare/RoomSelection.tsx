import React from 'react';
import { Card, Row, Col, Typography, Button, AutoComplete, Input, Spin } from 'antd';
import { SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { Room } from '../../types/room';
import { formatPrice } from '../../utils/compare';

const { Title, Text } = Typography;

interface RoomSelectionProps {
  roomA: Room | null;
  roomB: Room | null;
  searchA: string;
  searchB: string;
  searchOptionsA: any[];
  searchOptionsB: any[];
  allRooms: Room[];
  loadingRooms: boolean;
  onRoomASelect: (value: string, option: any) => void;
  onRoomBSelect: (value: string, option: any) => void;
  onRoomACardSelect: (room: Room) => void;
  onRoomBCardSelect: (room: Room) => void;
  onSearchA: (value: string) => void;
  onSearchB: (value: string) => void;
  onCompare: () => void;
  onClearRoomA: () => void;
  onClearRoomB: () => void;
}

/**
 * Room selection component for comparing two rooms
 * @param props - Component props
 * @returns JSX.Element
 */
const RoomSelection: React.FC<RoomSelectionProps> = ({
  roomA,
  roomB,
  searchA,
  searchB,
  searchOptionsA,
  searchOptionsB,
  allRooms,
  loadingRooms,
  onRoomASelect,
  onRoomBSelect,
  onRoomACardSelect,
  onRoomBCardSelect,
  onSearchA,
  onSearchB,
  onCompare,
  onClearRoomA,
  onClearRoomB,
}) => {

  return (
    <>
      {/* Room Selection Interface */}
      <Card className="mb-8 shadow-lg">
        <div className="space-y-6">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <div className="space-y-4">
                <Title level={3} className="text-xl font-semibold text-gray-800">
                  Room A
                </Title>
                <AutoComplete
                  value={searchA}
                  options={searchOptionsA}
                  onSelect={onRoomASelect}
                  onSearch={onSearchA}
                  placeholder=""
                  size="large"
                  className="w-full"
                  filterOption={false}
                >
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Type room name to search..."
                    size="large"
                  />
                </AutoComplete>
                {roomA && (
                  <Card size="small" className="bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <Text className="font-semibold text-blue-800">{roomA.name}</Text>
                        <div className="text-sm text-blue-600">
                          {roomA.facilityName} • {roomA.location.city}
                        </div>
                      </div>
                      <Button
                        type="text"
                        size="small"
                        onClick={onClearRoomA}
                      >
                        ×
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <div className="space-y-4">
                <Title level={3} className="text-xl font-semibold text-gray-800">
                  Room B
                </Title>
                <AutoComplete
                  value={searchB}
                  options={searchOptionsB}
                  onSelect={onRoomBSelect}
                  onSearch={onSearchB}
                  placeholder=""
                  size="large"
                  className="w-full"
                  filterOption={false}
                >
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Type room name to search..."
                    size="large"
                  />
                </AutoComplete>
                {roomB && (
                  <Card size="small" className="bg-green-50 border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <Text className="font-semibold text-green-800">{roomB.name}</Text>
                        <div className="text-sm text-green-600">
                          {roomB.facilityName} • {roomB.location.city}
                        </div>
                      </div>
                      <Button
                        type="text"
                        size="small"
                        onClick={onClearRoomB}
                      >
                        ×
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </Col>
          </Row>

          <div className="text-center">
            <Button
              type="primary"
              size="large"
              icon={<SwapOutlined />}
              onClick={onCompare}
              disabled={!roomA || !roomB}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Compare Rooms
            </Button>
          </div>
        </div>
      </Card>

      {/* Room Selection Cards */}
      <Card title="Or select from popular rooms" className="shadow-lg">
        {loadingRooms ? (
          <div className="text-center py-8">
            <Spin size="large" />
            <div className="mt-4 text-gray-600">Loading rooms...</div>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {allRooms.slice(0, 8).map((room) => (
              <Col key={room.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className={`h-full cursor-pointer transition-all duration-200 ${
                    roomA?.id === room.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : roomB?.id === room.id 
                      ? 'ring-2 ring-green-500 bg-green-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => {
                    if (!roomA) {
                      onRoomACardSelect(room);
                    } else if (!roomB && roomA.id !== room.id) {
                      onRoomBCardSelect(room);
                    } else if (roomA.id === room.id) {
                      onClearRoomA();
                    } else if (roomB?.id === room.id) {
                      onClearRoomB();
                    }
                  }}
                >
                  <div className="space-y-3">
                    <div className="text-center">
                      <Title level={5} className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                        {room.name}
                      </Title>
                      <Text className="text-xs text-gray-500">
                        {room.facilityName}
                      </Text>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary-600">
                        {room.overallRating.toFixed(1)}/10
                      </div>
                      <Text className="text-xs text-gray-500">Overall Rating</Text>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <Text className="text-gray-600">Rent:</Text>
                        <Text className="font-semibold">
                          {formatPrice(room.pricing.rent, room.pricing.currency)}
                        </Text>
                      </div>
                      <div className="flex justify-between text-xs">
                        <Text className="text-gray-600">Total:</Text>
                        <Text className="font-semibold">
                          {formatPrice(room.totalCost, room.pricing.currency)}
                        </Text>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 justify-center">
                      <Text className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {room.roomType.replace('_', ' ')}
                      </Text>
                      <Text className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {room.careLevel}
                      </Text>
                    </div>

                    <div className="text-center">
                      <Text className="text-xs text-gray-500">
                        {room.location.city}, {room.location.area}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>
    </>
  );
};

export default RoomSelection;
