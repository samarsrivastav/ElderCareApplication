import React from 'react';
import { Progress, Tooltip } from 'antd';
import { StarFilled } from '@ant-design/icons';

interface RatingIndicatorProps {
  rating: number;
  maxRating?: number;
  showLabel?: boolean;
  label?: string;
  size?: 'small' | 'default' | 'large';
  showStars?: boolean;
  className?: string;
}

/**
 * Rating indicator component with progress bar and optional stars
 * @param props - Component props
 * @returns JSX.Element
 */
const RatingIndicator: React.FC<RatingIndicatorProps> = ({
  rating,
  maxRating = 10,
  showLabel = true,
  label,
  size = 'default',
  showStars = false,
  className = '',
}) => {
  const percentage = (rating / maxRating) * 100;
  
  const getColor = (rating: number) => {
    if (rating >= 8) return '#10b981'; // green
    if (rating >= 6) return '#f59e0b'; // yellow
    if (rating >= 4) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getSizeConfig = (size: string) => {
    switch (size) {
      case 'small':
        return { height: 6, fontSize: '12px' };
      case 'large':
        return { height: 12, fontSize: '16px' };
      default:
        return { height: 8, fontSize: '14px' };
    }
  };

  const sizeConfig = getSizeConfig(size);

  const renderStars = () => {
    if (!showStars) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating / 2); // Convert 10-point scale to 5-star scale
    const hasHalfStar = rating % 2 >= 1;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarFilled
            key={i}
            className="text-yellow-400"
            style={{ fontSize: sizeConfig.fontSize }}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarFilled
            key={i}
            className="text-yellow-400 opacity-50"
            style={{ fontSize: sizeConfig.fontSize }}
          />
        );
      } else {
        stars.push(
          <StarFilled
            key={i}
            className="text-gray-300"
            style={{ fontSize: sizeConfig.fontSize }}
          />
        );
      }
    }
    
    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {label || 'Rating'}
          </span>
          <div className="flex items-center space-x-2">
            {renderStars()}
            <span className="text-sm font-semibold text-gray-900">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      )}
      
      <Tooltip title={`${rating.toFixed(1)} out of ${maxRating}`}>
        <Progress
          percent={percentage}
          strokeColor={getColor(rating)}
          trailColor="#e5e7eb"
          showInfo={false}
          size="small"
          style={{ height: sizeConfig.height }}
        />
      </Tooltip>
    </div>
  );
};

export default RatingIndicator;
