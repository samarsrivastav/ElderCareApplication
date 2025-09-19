import { v2 as cloudinary } from 'cloudinary';

/**
 * Cloudinary service for image uploads
 */
class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env['CLOUDINARY_CLOUD_NAME'] || '',
      api_key: process.env['CLOUDINARY_API_KEY'] || '',
      api_secret: process.env['CLOUDINARY_API_SECRET'] || '',
    });
  }

  /**
   * Upload image to Cloudinary
   * @param file - File buffer or stream
   * @param folder - Cloudinary folder name
   * @param publicId - Optional public ID for the image
   * @returns Promise with upload result
   */
  async uploadImage(
    file: string,
    folder: string = 'agevaa-blog',
    publicId?: string
  ): Promise<{ url: string; publicId: string }> {
    try {
      const uploadOptions: any = {
        folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
      };

      if (publicId) {
        uploadOptions.public_id = publicId;
      }

      const result = await cloudinary.uploader.upload(file, uploadOptions);
      
      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Upload image from base64 string
   * @param base64String - Base64 encoded image
   * @param folder - Cloudinary folder name
   * @param publicId - Optional public ID for the image
   * @returns Promise with upload result
   */
  async uploadImageFromBase64(
    base64String: string,
    folder: string = 'agevaa-blog',
    publicId?: string
  ): Promise<{ url: string; publicId: string }> {
    try {
      const uploadOptions: any = {
        folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
      };

      if (publicId) {
        uploadOptions.public_id = publicId;
      }

      const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64String}`, uploadOptions);
      
      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Delete image from Cloudinary
   * @param publicId - Public ID of the image to delete
   * @returns Promise with deletion result
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete image from Cloudinary');
    }
  }

  /**
   * Get image URL with transformations
   * @param publicId - Public ID of the image
   * @param transformations - Cloudinary transformations
   * @returns Transformed image URL
   */
  getImageUrl(publicId: string, transformations?: any): string {
    return cloudinary.url(publicId, {
      ...transformations,
      secure: true
    });
  }
}

export const cloudinaryService = new CloudinaryService();
