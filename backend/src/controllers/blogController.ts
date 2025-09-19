import { Request, Response } from 'express';
import { Blog } from '../models/Blog';
import { cloudinaryService } from '../services/cloudinaryService';

/**
 * Blog creation interface
 */
interface CreateBlogData {
  title: string;
  description: string;
  content: string;
  image: string; // Base64 image or Cloudinary URL
  tags: string[];
  published: boolean;
}

/**
 * Blog update interface
 */
interface UpdateBlogData {
  title?: string;
  description?: string;
  content?: string;
  image?: string;
  tags?: string[];
  published?: boolean;
}

/**
 * Blog controller for CRUD operations
 */
export class BlogController {
  /**
   * Create a new blog post
   * @param req - Express request object
   * @param res - Express response object
   */
  async createBlog(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, content, image, tags, published }: CreateBlogData = req.body;
      const adminId = (req as any).adminId;

      // Validate required fields
      if (!title || !description || !content || !image) {
        res.status(400).json({
          success: false,
          message: 'Title, description, content, and image are required'
        });
        return;
      }

      // Get admin details for author info
      const Admin = (await import('../models/Admin')).Admin;
      const admin = await Admin.findById(adminId);
      if (!admin) {
        res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
        return;
      }

      let imageUrl = image;

      // If image is base64, use it directly (Cloudinary not configured)
      if (image.startsWith('data:image/')) {
        // For now, use the base64 image directly
        // In production, you would upload to Cloudinary or another service
        imageUrl = image;
      }

      // Create blog post
      const blog = new Blog({
        title,
        description,
        content,
        image: imageUrl,
        authorName: admin.name,
        authorId: adminId,
        tags: tags || [],
        published: published || false
      });

      await blog.save();

      res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        data: { blog }
      });
    } catch (error) {
      console.error('Create blog error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get all blog posts (public)
   * @param req - Express request object
   * @param res - Express response object
   */
  async getAllBlogs(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const skip = (page - 1) * limit;
      const published = req.query['published'] !== 'false'; // Default to published only

      const filter: any = {};
      if (published) {
        filter.published = true;
      }

      const blogs = await Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content'); // Exclude full content for listing

      const total = await Blog.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: {
          blogs,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get all blogs error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get blog by slug
   * @param req - Express request object
   * @param res - Express response object
   */
  async getBlogBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const blog = await Blog.findOne({ slug, published: true });
      if (!blog) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
        return;
      }

      // Increment view count
      blog.views += 1;
      await blog.save();

      res.status(200).json({
        success: true,
        data: { blog }
      });
    } catch (error) {
      console.error('Get blog by slug error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get blog by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  async getBlogById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const blog = await Blog.findById(id);
      if (!blog) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { blog }
      });
    } catch (error) {
      console.error('Get blog by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update blog post
   * @param req - Express request object
   * @param res - Express response object
   */
  async updateBlog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateBlogData = req.body;
      const adminId = (req as any).adminId;

      const blog = await Blog.findById(id);
      if (!blog) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
        return;
      }

      // Check if admin is the author or super admin
      if (blog.authorId.toString() !== adminId) {
        const Admin = (await import('../models/Admin')).Admin;
        const admin = await Admin.findById(adminId);
        if (!admin || admin.role !== 'super_admin') {
          res.status(403).json({
            success: false,
            message: 'You can only edit your own blog posts'
          });
          return;
        }
      }

      // Handle image update
      if (updates.image && updates.image.startsWith('data:image/')) {
        // For now, use the base64 image directly
        // In production, you would upload to Cloudinary or another service
        updates.image = updates.image;
      }

      // Update blog
      Object.assign(blog, updates);
      await blog.save();

      res.status(200).json({
        success: true,
        message: 'Blog post updated successfully',
        data: { blog }
      });
    } catch (error) {
      console.error('Update blog error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete blog post
   * @param req - Express request object
   * @param res - Express response object
   */
  async deleteBlog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = (req as any).adminId;

      const blog = await Blog.findById(id);
      if (!blog) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
        return;
      }

      // Check if admin is the author or super admin
      if (blog.authorId.toString() !== adminId) {
        const Admin = (await import('../models/Admin')).Admin;
        const admin = await Admin.findById(adminId);
        if (!admin || admin.role !== 'super_admin') {
          res.status(403).json({
            success: false,
            message: 'You can only delete your own blog posts'
          });
          return;
        }
      }

      // Delete image from Cloudinary if it's a Cloudinary URL
      if (blog.image.includes('cloudinary.com')) {
        const publicId = blog.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinaryService.deleteImage(publicId);
        }
      }

      await Blog.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully'
      });
    } catch (error) {
      console.error('Delete blog error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get admin's blog posts
   * @param req - Express request object
   * @param res - Express response object
   */
  async getAdminBlogs(req: Request, res: Response): Promise<void> {
    try {
      const adminId = (req as any).adminId;
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const skip = (page - 1) * limit;

      const blogs = await Blog.find({ authorId: adminId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Blog.countDocuments({ authorId: adminId });

      res.status(200).json({
        success: true,
        data: {
          blogs,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get admin blogs error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export const blogController = new BlogController();
