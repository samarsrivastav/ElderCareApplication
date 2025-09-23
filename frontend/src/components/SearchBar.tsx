import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSearchButton?: boolean;
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
  showSearchButton = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {showSearchButton ? (
        <div className="flex gap-2">
          <Input
            size="large"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
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
            className="flex-1"
            allowClear={false}
          />
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </div>
      ) : (
        <Input
          size="large"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
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
      )}
    </div>
  );
};

export default SearchBar;
