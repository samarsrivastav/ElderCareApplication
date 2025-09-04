import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { SEARCH_DEBOUNCE_DELAY } from '../constants';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Search bar component with debounced search functionality
 * @param props - Component props
 * @returns JSX.Element
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search rooms, facilities, or locations...',
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        size="large"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        prefix={<SearchOutlined className="text-primary-500" />}
        suffix={
          searchQuery && (
            <Button
              type="text"
              icon={<ClearOutlined />}
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
            />
          )
        }
        className="w-full"
        allowClear={false}
      />
    </div>
  );
};

export default SearchBar;
