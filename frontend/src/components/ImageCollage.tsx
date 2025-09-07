import React from 'react';
import ImageWithFallback from './ImageWithFallback';

/**
 * Props for the ImageCollage component
 */
interface ImageCollageProps {
  /** Array of image URLs to display in the collage */
  images: string[];
  /** Alt text prefix for images (will be appended with image index) */
  altPrefix?: string;
  /** Callback function when "View more" is clicked */
  onViewMore?: () => void;
  /** Callback function when an individual image is clicked */
  onImageClick?: (index: number) => void;
  /** Custom CSS classes for the container */
  className?: string;
  /** Height of the collage container */
  height?: string;
}

/**
 * Image collage component that displays up to 4 images in a distinctive layout
 * - First image: Large on left (60% width, full height)
 * - Second image: Upper right (40% width, half height)
 * - Third image: Bottom left of right side (20% width, half height)
 * - Fourth image: Bottom right of right side (20% width, half height) with overlay
 * 
 * @param props - Component props
 * @returns JSX.Element
 */
const ImageCollage: React.FC<ImageCollageProps> = ({
  images,
  altPrefix = 'Image',
  onViewMore,
  onImageClick,
  className = '',
  height = '400px'
}) => {
  // Ensure we have at least one image
  if (!images || images.length === 0) {
    return (
      <div className={`w-full ${height} bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  /**
   * Handle click on the "View more" overlay
   */
  const handleViewMoreClick = (): void => {
    if (onViewMore) {
      onViewMore();
    }
  };

  /**
   * Handle keyboard navigation for the view more button
   */
  const handleViewMoreKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewMoreClick();
    }
  };

  return (
    <div 
      className={`w-full rounded-lg overflow-hidden shadow-lg ${className}`}
      style={{ height }}
    >
      {/* Desktop Layout - Different layouts based on image count */}
      
      {/* 1 Image Layout - 100% width */}
      {images.length === 1 && (
        <div className="hidden md:block w-full h-full p-4">
          <div 
            className="w-full h-full relative group cursor-pointer"
            onClick={() => onImageClick?.(0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onImageClick?.(0);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${altPrefix} 1`}
          >
            <ImageWithFallback
              src={images[0]}
              alt={`${altPrefix} 1`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                Click to view
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2 Images Layout - 50-50 split */}
      {images.length === 2 && (
        <div className="hidden md:grid w-full h-full grid-cols-2 gap-4 p-4">
          {images.map((image, index) => (
            <div 
              key={`desktop-${image.slice(-10)}-${index}`}
              className="relative group cursor-pointer"
              onClick={() => onImageClick?.(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onImageClick?.(index);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${altPrefix} ${index + 1}`}
            >
              <ImageWithFallback
                src={image}
                alt={`${altPrefix} ${index + 1}`}
                className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                  Click to view
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3 Images Layout - 60% left, 40% right with 2 stacked images */}
      {images.length === 3 && (
        <div className="hidden md:grid w-full h-full grid-cols-5 grid-rows-2 gap-4 p-4">
          {/* First Image - Large on left (60% width, full height) */}
          <div 
            className="col-span-3 row-span-2 relative group cursor-pointer"
            onClick={() => onImageClick?.(0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onImageClick?.(0);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${altPrefix} 1`}
          >
            <ImageWithFallback
              src={images[0]}
              alt={`${altPrefix} 1`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                Click to view
              </div>
            </div>
          </div>

          {/* Second Image - Upper right */}
          <div 
            className="col-span-2 row-span-1 relative group cursor-pointer"
            onClick={() => onImageClick?.(1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onImageClick?.(1);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${altPrefix} 2`}
          >
            <ImageWithFallback
              src={images[1]}
              alt={`${altPrefix} 2`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                Click to view
              </div>
            </div>
          </div>

          {/* Third Image - Lower right */}
          <div 
            className="col-span-2 row-span-1 relative group cursor-pointer"
            onClick={() => onImageClick?.(2)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onImageClick?.(2);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${altPrefix} 3`}
          >
            <ImageWithFallback
              src={images[2]}
              alt={`${altPrefix} 3`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                Click to view
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4+ Images Layout - Original layout */}
      {images.length >= 4 && (
        <div className="hidden md:grid w-full h-full grid-cols-5 grid-rows-2 gap-4 p-4">
          {/* First Image - Large on left (60% width, full height) */}
          <div 
            className="col-span-3 row-span-2 relative group cursor-pointer"
            onClick={() => onImageClick?.(0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onImageClick?.(0);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${altPrefix} 1`}
          >
            <ImageWithFallback
              src={images[0]}
              alt={`${altPrefix} 1`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                Click to view
              </div>
            </div>
          </div>

          {/* Second Image - Upper right (40% width, half height) */}
          <div 
            className="col-span-2 row-span-1 relative group cursor-pointer"
            onClick={() => onImageClick?.(1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onImageClick?.(1);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${altPrefix} 2`}
          >
            <ImageWithFallback
              src={images[1]}
              alt={`${altPrefix} 2`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                Click to view
              </div>
            </div>
          </div>

          {/* Third Image - Bottom left of right side (20% width, half height) */}
          <div 
            className="col-span-1 row-span-1 relative group cursor-pointer"
            onClick={() => onImageClick?.(2)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onImageClick?.(2);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${altPrefix} 3`}
          >
            <ImageWithFallback
              src={images[2]}
              alt={`${altPrefix} 3`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                Click to view
              </div>
            </div>
          </div>

          {/* Fourth Image - Bottom right of right side (20% width, half height) with overlay */}
          <div 
            className="col-span-1 row-span-1 relative group cursor-pointer"
            onClick={() => onImageClick?.(3)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onImageClick?.(3);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${altPrefix} 4`}
          >
            <ImageWithFallback
              src={images[3]}
              alt={`${altPrefix} 4`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                Click to view
              </div>
            </div>
            {/* "Click to view more" overlay for 5+ images */}
            {images.length > 4 && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-opacity-60 hover:backdrop-blur-sm"
                onClick={handleViewMoreClick}
                onKeyDown={handleViewMoreKeyDown}
                role="button"
                tabIndex={0}
                aria-label="View more images"
              >
                <div className="text-white text-sm font-bold text-center px-2">
                  +{images.length - 4} more
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Layout - Responsive for all image counts */}
      <div className="md:hidden w-full h-full flex flex-col gap-2 p-2">
        {/* Single Image Layout on Mobile */}
        {images.length === 1 && (
          <div 
            className="w-full h-full relative group cursor-pointer"
            onClick={() => onImageClick?.(0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onImageClick?.(0);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${altPrefix} 1`}
          >
            <ImageWithFallback
              src={images[0]}
              alt={`${altPrefix} 1`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                Click to view
              </div>
            </div>
          </div>
        )}

        {/* Multiple Images Layout on Mobile */}
        {images.length > 1 && (
          <>
            {/* First Image - Takes most space on mobile */}
            <div 
              className="flex-1 relative group cursor-pointer"
              onClick={() => onImageClick?.(0)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onImageClick?.(0);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${altPrefix} 1`}
            >
              <ImageWithFallback
                src={images[0]}
                alt={`${altPrefix} 1`}
                className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                  Click to view
                </div>
              </div>
            </div>

            {/* Additional Images - Horizontal strip at bottom */}
            <div className="flex gap-2 h-24">
              {images.slice(1, 4).map((image, index) => (
                <div 
                  key={`mobile-${image.slice(-10)}-${index}`} 
                  className="flex-1 relative group cursor-pointer"
                  onClick={() => onImageClick?.(index + 1)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onImageClick?.(index + 1);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${altPrefix} ${index + 2}`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${altPrefix} ${index + 2}`}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-xs font-medium">
                      Click to view
                    </div>
                  </div>
                  {/* "View more" overlay on last visible image if there are more */}
                  {index === 2 && images.length > 4 && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-opacity-60"
                      onClick={handleViewMoreClick}
                      onKeyDown={handleViewMoreKeyDown}
                      role="button"
                      tabIndex={0}
                      aria-label="View more images"
                    >
                      <div className="text-white text-xs font-bold text-center px-1">
                        +{images.length - 4} more
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCollage;
