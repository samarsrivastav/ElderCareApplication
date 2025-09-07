import React from 'react';
import { Card, Select, Slider, Button, Space, Row, Col } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { RoomFilters as RoomFiltersType } from '../types/room';
import { ROOM_TYPES } from '../constants';

interface RoomFiltersProps {
  filters: RoomFiltersType;
  onFiltersChange: (filters: RoomFiltersType) => void;
  onReset: () => void;
  className?: string;
}

/**
 * Room filters component for advanced filtering options
 * @param props - Component props
 * @returns JSX.Element
 */
const RoomFilters: React.FC<RoomFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  className = '',
}) => {
  const handleFilterChange = (key: keyof RoomFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const roomTypeOptions = [
    { label: 'Assisted Living', value: ROOM_TYPES.ASSISTED_LIVING },
    { label: 'Independent Living', value: ROOM_TYPES.INDEPENDENT_LIVING },
    { label: 'Memory Care', value: ROOM_TYPES.MEMORY_CARE },
    { label: 'Daycare', value: ROOM_TYPES.DAYCARE },
  ];


  return (
    <Card
      title={
        <Space>
          <FilterOutlined className="text-primary-500" />
          <span>Filters</span>
        </Space>
      }
      className={`shadow-sm ${className}`}
      extra={
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={onReset}
          className="text-gray-500 hover:text-primary-500"
        >
          Reset
        </Button>
      }
    >
      <Space direction="vertical" size="large" className="w-full">
        <div className="space-y-4">
          <div>
            <label htmlFor="room-type-select" className="block text-sm font-medium text-gray-700 mb-2">
              Room Type
            </label>
            <Select
              id="room-type-select"
              placeholder="Select room type"
              value={filters.roomType}
              onChange={(value) => handleFilterChange('roomType', value)}
              options={roomTypeOptions}
              className="w-full"
              allowClear
              size="middle"
            />
          </div>
          
          <div>
            <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <Select
              id="city-select"
              placeholder="Select city"
              value={filters.city}
              onChange={(value) => handleFilterChange('city', value)}
              className="w-full"
              allowClear
              size="middle"
            >
              <Select.Option value="Gurugram">Gurugram</Select.Option>
              <Select.Option value="Delhi">Delhi</Select.Option>
              <Select.Option value="Mumbai">Mumbai</Select.Option>
              <Select.Option value="Bangalore">Bangalore</Select.Option>
            </Select>
          </div>
          
          <div>
            <label htmlFor="area-select" className="block text-sm font-medium text-gray-700 mb-2">
              Area
            </label>
            <Select
              id="area-select"
              placeholder="Select area"
              value={filters.area}
              onChange={(value) => handleFilterChange('area', value)}
              className="w-full"
              allowClear
              size="middle"
            >
              <Select.Option value="Sector 53">Sector 53</Select.Option>
              <Select.Option value="Sector 54">Sector 54</Select.Option>
              <Select.Option value="Sector 56">Sector 56</Select.Option>
            </Select>
          </div>
        </div>

        <Row gutter={[16, 20]}>
          <Col xs={24} sm={12}>
            <div className="h-full">
              <label htmlFor="rent-range-slider" className="block text-sm font-medium text-gray-700 mb-3">
                Rent Range (₹)
              </label>
              <div className="px-3">
                <Slider
                  range
                  min={0}
                  max={200000}
                  step={5000}
                  value={[filters.minRent || 0, filters.maxRent || 200000]}
                  onChange={(value) => {
                    handleFilterChange('minRent', value[0]);
                    handleFilterChange('maxRent', value[1]);
                  }}
                  tooltip={{
                    formatter: (value) => `₹${value?.toLocaleString()}`,
                  }}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₹{(filters.minRent || 0).toLocaleString()}</span>
                  <span>₹{(filters.maxRent || 200000).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="h-full">
              <label htmlFor="rating-slider" className="block text-sm font-medium text-gray-700 mb-3">
                Minimum Rating
              </label>
              <div className="px-3">
                <Slider
                  min={1}
                  max={10}
                  step={0.5}
                  value={filters.minRating || 1}
                  onChange={(value) => handleFilterChange('minRating', value)}
                  tooltip={{
                    formatter: (value) => `${value}/10`,
                  }}
                />
                <div className="text-center text-sm text-gray-500 mt-3">
                  {(filters.minRating || 1).toFixed(1)}/10
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default RoomFilters;
