import React, { useState } from 'react';

/**
 * Props for the ImageWithFallback component
 */
interface ImageWithFallbackProps {
  /** Source URL of the image */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** CSS classes to apply to the image */
  className?: string;
  /** Fallback image source (defaults to image-not-found.svg) */
  fallbackSrc?: string;
  /** Additional props to pass to the img element */
  [key: string]: any;
}

/**
 * Image component with automatic fallback to a default image when the source fails to load
 * @param props - Component props
 * @returns JSX.Element
 */
const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/image-not-found.svg',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  /**
   * Handle image load error by switching to fallback image
   */
  const handleError = (): void => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  /**
   * Handle successful image load
   */
  const handleLoad = (): void => {
    setHasError(false);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default ImageWithFallback;
