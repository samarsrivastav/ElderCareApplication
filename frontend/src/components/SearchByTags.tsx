import React, { useState } from 'react';
import { Card, Typography, Button, Tag } from 'antd';
import { TagsOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface SearchByTagsProps {
  className?: string;
}

/**
 * Search by tags component with predefined tag options
 * @param props - Component props
 * @returns JSX.Element
 */
const SearchByTags: React.FC<SearchByTagsProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = [
    { name: '24/7 Care', color: 'blue' },
    { name: 'Memory Care', color: 'cyan' },
    { name: 'Physical Therapy', color: 'geekblue' },
    { name: 'Meal Service', color: 'blue' },
    { name: 'Housekeeping', color: 'cyan' },
    { name: 'Transportation', color: 'geekblue' },
    { name: 'Social Activities', color: 'blue' },
    { name: 'Medical Support', color: 'cyan' },
    { name: 'Emergency Response', color: 'geekblue' },
    { name: 'Family Visits', color: 'blue' },
    { name: 'Garden Access', color: 'cyan' },
    { name: 'WiFi Available', color: 'geekblue' },
    { name: 'Pet Friendly', color: 'blue' },
    { name: 'Wheelchair Access', color: 'cyan' },
    { name: 'Private Room', color: 'geekblue' }
  ];

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(tag => tag !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
  };

  const handleSearchWithTags = () => {
    if (selectedTags.length > 0) {
      navigate('/rooms', { 
        state: { 
          searchQuery: selectedTags.join(', '), 
          searchType: 'tags',
          selectedTags: selectedTags
        } 
      });
    }
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <div className="text-center mb-6">
        <div className="text-4xl text-blue-600 mb-4">
          <TagsOutlined />
        </div>
        <Title level={3} className="text-xl font-semibold text-gray-800 mb-2">
          Search by Tags
        </Title>
        <Text className="text-gray-600">
          Find facilities with specific services and amenities
        </Text>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {tags.map((tag) => (
            <Tag
              key={tag.name}
              color={selectedTags.includes(tag.name) ? tag.color : 'default'}
              className={`cursor-pointer transition-all duration-200 ${
                selectedTags.includes(tag.name)
                  ? 'opacity-100 scale-105'
                  : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => handleTagToggle(tag.name)}
            >
              {tag.name}
            </Tag>
          ))}
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <Text className="text-sm text-gray-600 mb-2 block">Selected tags:</Text>
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tag) => (
              <Tag
                key={tag}
                color="blue"
                closable
                onClose={() => handleTagToggle(tag)}
                className="text-xs"
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      )}

      <div className="text-center space-y-2">
        <Button
          type="primary"
          size="large"
          onClick={handleSearchWithTags}
          disabled={selectedTags.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {selectedTags.length > 0 
            ? `Search with ${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}`
            : 'Search with Tags'
          }
        </Button>
        
        {selectedTags.length > 0 && (
          <Button
            type="link"
            onClick={handleClearTags}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear All Tags
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SearchByTags;
