import { Request, Response } from 'express';
import { Admin } from '../models/Admin';
import { Contact } from '../models/Contact';
import { jwtService } from '../services/jwtService';

/**
 * Admin authentication interface
 */
interface AdminLoginData {
  username: string;
  password: string;
}

/**
 * Admin controller for authentication and admin operations
 */
export class AdminController {
  /**
   * Admin login
   * @param req - Express request object
   * @param res - Express response object
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password }: AdminLoginData = req.body;

      // Validate required fields
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
        return;
      }

      // Find admin by username or email
      const admin = await Admin.findOne({
        $or: [
          { username: username.toLowerCase() },
          { email: username.toLowerCase() }
        ],
        isActive: true
      });

      if (!admin) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      // Check password
      const isPasswordValid = await admin.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      // Generate JWT token
      const token = jwtService.generateToken(
        (admin._id as any).toString(),
        admin.username,
        admin.role
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          admin: {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            name: admin.name,
            role: admin.role
          }
        }
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get admin profile
   * @param req - Express request object
   * @param res - Express response object
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const adminId = (req as any).adminId;

      const admin = await Admin.findById(adminId).select('-password');
      if (!admin) {
        res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          admin: {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            lastLogin: admin.lastLogin
          }
        }
      });
    } catch (error) {
      console.error('Get admin profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get all contact form submissions
   * @param req - Express request object
   * @param res - Express response object
   */
  async getContacts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const skip = (page - 1) * limit;

      const contacts = await Contact.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Contact.countDocuments();

      res.status(200).json({
        success: true,
        data: {
          contacts,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get contact by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  async getContactById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const contact = await Contact.findById(id);
      if (!contact) {
        res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { contact }
      });
    } catch (error) {
      console.error('Get contact by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete contact
   * @param req - Express request object
   * @param res - Express response object
   */
  async deleteContact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const contact = await Contact.findByIdAndDelete(id);
      if (!contact) {
        res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Contact deleted successfully'
      });
    } catch (error) {
      console.error('Delete contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get dashboard statistics
   * @param req - Express request object
   * @param res - Express response object
   */
  async getDashboardStats(_req: Request, res: Response): Promise<void> {
    try {
      const Blog = (await import('../models/Blog')).Blog;
      
      const [
        totalContacts,
        recentContacts,
        totalBlogs,
        publishedBlogs
      ] = await Promise.all([
        Contact.countDocuments(),
        Contact.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
        Blog.countDocuments(),
        Blog.countDocuments({ published: true })
      ]);

      res.status(200).json({
        success: true,
        data: {
          contacts: {
            total: totalContacts,
            recent: recentContacts
          },
          blogs: {
            total: totalBlogs,
            published: publishedBlogs
          }
        }
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export const adminController = new AdminController();
