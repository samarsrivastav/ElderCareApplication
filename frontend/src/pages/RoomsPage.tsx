import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Pagination, Spin, Alert, Button, Space, Typography, Drawer } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import RoomFilters from '../components/RoomFilters';
import RoomCard from '../components/RoomCard';
import { roomService } from '../services/roomService';
import { ROOM_TYPES, PAGINATION_DEFAULTS } from '../constants';
import { Room, RoomFilters as RoomFiltersType, RoomListResponse } from '../types/room';

const { Title, Text } = Typography;

/**
 * Rooms listing page with search, filters, and pagination
 * @returns JSX.Element
 */
const RoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RoomFiltersType>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>({
    page: PAGINATION_DEFAULTS.PAGE,
    limit: PAGINATION_DEFAULTS.LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [compareList, setCompareList] = useState<string[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        search: searchQuery || undefined,
      };

      const response: RoomListResponse = await roomService.getAllRooms(params);
      
      if (response.success) {
        setRooms(response.data.rooms);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        }));
      }
    } catch (err) {
      setError('Failed to fetch rooms. Please try again.');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, searchQuery]);

  // Handle navigation state from homepage (city/service/tag search)
  useEffect(() => {
    const state: any = location.state;
    if (!state) return;

    const nextFilters: RoomFiltersType = { ...filters };

    if (state.searchType === 'service' && typeof state.searchQuery === 'string') {
      // Map service names to roomType constants when possible
      const name = state.searchQuery.toLowerCase();
      const map: Record<string, string> = {
        'assisted living facilities': ROOM_TYPES.ASSISTED_LIVING,
        'assisted living': ROOM_TYPES.ASSISTED_LIVING,
        'memory care homes': ROOM_TYPES.MEMORY_CARE,
        'memory care': ROOM_TYPES.MEMORY_CARE,
        'elder daycare': ROOM_TYPES.DAYCARE,
        'daycare': ROOM_TYPES.DAYCARE,
        'independent living': ROOM_TYPES.INDEPENDENT_LIVING,
      };
      const mapped = map[name];
      if (mapped) {
        nextFilters.roomType = mapped as RoomFiltersType['roomType'];
        setFilters(nextFilters);
        setSearchQuery('');
      } else {
        setSearchQuery(state.searchQuery);
      }
      setPagination(prev => ({ ...prev, page: 1 }));
      return;
    }

    if (state.searchType === 'city' && typeof state.searchQuery === 'string') {
      // Try to set city filter if supported in our filters; otherwise, search text
      const supportedCities = ['Gurugram', 'Delhi', 'Mumbai', 'Bangalore'];
      const match = supportedCities.find(c => c.toLowerCase() === String(state.searchQuery).toLowerCase());
      if (match) {
        nextFilters.city = match;
        setFilters(nextFilters);
        setSearchQuery('');
      } else {
        setSearchQuery(state.searchQuery);
      }
      setPagination(prev => ({ ...prev, page: 1 }));
      return;
    }

    if (state.searchQuery) {
      setSearchQuery(state.searchQuery);
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFiltersChange = (newFilters: RoomFiltersType) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleViewDetails = (roomId: string) => {
    navigate(`/rooms/${roomId}`);
  };

  const handleToggleCompare = (roomId: string) => {
    if (compareList.includes(roomId)) {
      // Remove from compare list
      setCompareList(prev => prev.filter(id => id !== roomId));
      return;
    }
    
    // Add to compare list
    if (compareList.length >= 5) {
      // Remove the first item if we're at the limit
      setCompareList(prev => [...prev.slice(1), roomId]);
    } else {
      setCompareList(prev => [...prev, roomId]);
    }
  };

  const handleCompareRooms = () => {
    if (compareList.length >= 2) {
      navigate('/compare', { state: { roomIds: compareList } });
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={fetchRooms}>
              Retry
            </Button>
          }
        />
      );
    }

    if (rooms.length === 0) {
      return (
        <div className="text-center py-20">
          <Title level={3} className="text-gray-500">
            No rooms found
          </Title>
          <Text className="text-gray-400">
            Try adjusting your search criteria or filters
          </Text>
          <div className="mt-4">
            <Button onClick={handleResetFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        <Row gutter={[16, 16]}>
          {rooms.map((room) => (
            <Col key={room.id} xs={24} sm={12} md={12} lg={8} xl={8}>
              <RoomCard
                room={room}
                onViewDetails={handleViewDetails}
                onAddToCompare={handleToggleCompare}
                isInCompareList={compareList.includes(room.id)}
              />
            </Col>
          ))}
        </Row>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={pagination.page}
              total={pagination.total}
              pageSize={pagination.limit}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} rooms`
              }
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <Title level={2} className="mb-2 text-xl sm:text-2xl">
                Find Your Perfect Room
              </Title>
              <Text className="text-gray-600 text-sm sm:text-base hidden sm:block">
                Discover the best elder care facilities tailored to your needs
              </Text>
            </div>
            
            {compareList.length > 0 && (
              <Button
                type="primary"
                size="large"
                onClick={handleCompareRooms}
                disabled={compareList.length < 2}
                className="hidden sm:flex"
              >
                Compare Rooms ({compareList.length})
              </Button>
            )}
          </div>

          <div className="mt-4 sm:mt-6">
            <SearchBar
              onSearch={handleSearch}
              className="max-w-2xl"
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <Space className="flex-wrap">
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFiltersVisible(true)}
                className="md:hidden"
                size="small"
              >
                Filters
              </Button>
              <Text className="text-gray-600 text-sm">
                {pagination.total} rooms found
              </Text>
              {compareList.length > 0 && (
                <Button
                  type="primary"
                  size="small"
                  onClick={handleCompareRooms}
                  disabled={compareList.length < 2}
                  className="sm:hidden"
                >
                  Compare ({compareList.length})
                </Button>
              )}
            </Space>
            
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchRooms}
              loading={loading}
              size="small"
              className="self-start sm:self-auto"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Row gutter={[16, 16]}>
          <Col xs={0} md={0} lg={6} xl={6}>
            <div className="sticky top-4">
              <RoomFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
              />
            </div>
          </Col>
          
          <Col xs={24} md={24} lg={18} xl={18}>
            {renderContent()}
          </Col>
        </Row>
      </div>

      <Drawer
        title="Filters"
        placement="right"
        onClose={() => setFiltersVisible(false)}
        open={filtersVisible}
        width={400}
        className="lg:hidden"
      >
        <RoomFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />
      </Drawer>
    </div>
  );
};

export default RoomsPage;
