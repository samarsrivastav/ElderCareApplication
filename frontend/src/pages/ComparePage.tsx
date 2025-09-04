import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography, Spin, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { roomService } from '../services/roomService';
import { Room, RoomComparisonResponse, RoomListResponse } from '../types/room';
import { RoomSelection, ComparisonResults } from '../components/compare';
import { filterRoomsBySearch, createSearchOptions } from '../utils/compare';

const { Title, Text } = Typography;

/**
 * Room comparison page for side-by-side comparison
 * @returns JSX.Element
 */
const ComparePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonSummary, setComparisonSummary] = useState<any>(null);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  
  // New states for room selection
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [roomA, setRoomA] = useState<Room | null>(null);
  const [roomB, setRoomB] = useState<Room | null>(null);
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [searchOptionsA, setSearchOptionsA] = useState<any[]>([]);
  const [searchOptionsB, setSearchOptionsB] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    const roomIds = location.state?.roomIds || [];
    if (roomIds.length > 0) {
      setSelectedRooms(roomIds);
      fetchComparisonData(roomIds);
    } else {
      setLoading(false);
    }
    fetchAllRooms();
  }, [location.state]);

  const fetchAllRooms = async () => {
    try {
      setLoadingRooms(true);
      const response: RoomListResponse = await roomService.getAllRooms({ limit: 50 });
      if (response.success) {
        setAllRooms(response.data.rooms);
        const searchOptions = createSearchOptions(response.data.rooms);
        setSearchOptionsA(searchOptions);
        setSearchOptionsB(searchOptions);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchComparisonData = async (roomIds: string[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: RoomComparisonResponse = await roomService.compareRooms(roomIds);
      
      if (response.success) {
        setRooms(response.data.rooms);
        setComparisonSummary(response.data.summary);
      }
    } catch (err) {
      setError('Failed to fetch comparison data. Please try again.');
      console.error('Error fetching comparison data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRoom = (roomId: string) => {
    const newSelectedRooms = selectedRooms.filter(id => id !== roomId);
    setSelectedRooms(newSelectedRooms);
    
    if (newSelectedRooms.length >= 2) {
      fetchComparisonData(newSelectedRooms);
    } else {
      setRooms([]);
      setComparisonSummary(null);
    }
  };

  const handleAddMoreRooms = () => {
    navigate('/rooms');
  };

  const handleRoomASelect = (value: string, option: any) => {
    setRoomA(option.room);
    setSearchA(value);
  };

  const handleRoomBSelect = (value: string, option: any) => {
    setRoomB(option.room);
    setSearchB(value);
  };

  const handleRoomACardSelect = (room: Room) => {
    setRoomA(room);
    setSearchA(room.name);
  };

  const handleRoomBCardSelect = (room: Room) => {
    setRoomB(room);
    setSearchB(room.name);
  };

  const handleCompare = () => {
    if (roomA && roomB) {
      const roomIds = [roomA.id, roomB.id];
      setSelectedRooms(roomIds);
      fetchComparisonData(roomIds);
    }
  };

  const handleSearchA = (value: string) => {
    setSearchA(value);
    const filtered = filterRoomsBySearch(allRooms, value);
    setSearchOptionsA(createSearchOptions(filtered));
  };

  const handleSearchB = (value: string) => {
    setSearchB(value);
    const filtered = filterRoomsBySearch(allRooms, value);
    setSearchOptionsB(createSearchOptions(filtered));
  };

  const handleClearRoomA = () => {
    setRoomA(null);
    setSearchA('');
  };

  const handleClearRoomB = () => {
    setRoomB(null);
    setSearchB('');
  };

  const handleBackToRooms = () => {
    navigate('/rooms');
  };

  const handleViewRoomDetails = (roomId: string) => {
    navigate(`/rooms/${roomId}`);
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Alert
          message="Error"
          description={error}
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

  if (selectedRooms.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToRooms}
              className="mb-4"
            >
              Back to Rooms
            </Button>
          </div>

          <div className="text-center mb-8">
            <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
              Compare Rooms
            </Title>
            <Text className="text-lg text-gray-600">
              Select two rooms to compare their features, pricing, and ratings
            </Text>
          </div>

          <RoomSelection
            roomA={roomA}
            roomB={roomB}
            searchA={searchA}
            searchB={searchB}
            searchOptionsA={searchOptionsA}
            searchOptionsB={searchOptionsB}
            allRooms={allRooms}
            loadingRooms={loadingRooms}
            onRoomASelect={handleRoomASelect}
            onRoomBSelect={handleRoomBSelect}
            onRoomACardSelect={handleRoomACardSelect}
            onRoomBCardSelect={handleRoomBCardSelect}
            onSearchA={handleSearchA}
            onSearchB={handleSearchB}
            onCompare={handleCompare}
            onClearRoomA={handleClearRoomA}
            onClearRoomB={handleClearRoomB}
          />
        </div>
      </div>
    );
  }

  return (
    <ComparisonResults
      rooms={rooms}
      comparisonSummary={comparisonSummary}
      onBackToRooms={handleBackToRooms}
      onAddMoreRooms={handleAddMoreRooms}
      onRemoveRoom={handleRemoveRoom}
      onViewRoomDetails={handleViewRoomDetails}
    />
  );
};

export default ComparePage;