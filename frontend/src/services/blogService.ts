import { BlogResponse, CreateBlogData, UpdateBlogData } from '../types/blog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Blog service for API interactions
 */
class BlogService {
  private getAuthToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Get all blog posts
   * @param page - Page number
   * @param limit - Items per page
   * @param published - Filter by published status
   * @returns Promise with blog posts
   */
  async getAllBlogs(page: number = 1, limit: number = 10, published: boolean = true): Promise<BlogResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blogs?page=${page}&limit=${limit}&published=${published}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch blogs');
      }

      return data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  /**
   * Get blog by slug
   * @param slug - Blog slug
   * @returns Promise with blog post
   */
  async getBlogBySlug(slug: string): Promise<BlogResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/slug/${slug}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch blog');
      }

      return data;
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      throw error;
    }
  }

  /**
   * Get blog by ID
   * @param id - Blog ID
   * @returns Promise with blog post
   */
  async getBlogById(id: string): Promise<BlogResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch blog');
      }

      return data;
    } catch (error) {
      console.error('Error fetching blog by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new blog post
   * @param blogData - Blog creation data
   * @returns Promise with created blog post
   */
  async createBlog(blogData: CreateBlogData): Promise<BlogResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(blogData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create blog');
      }

      return data;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  /**
   * Update a blog post
   * @param id - Blog ID
   * @param blogData - Blog update data
   * @returns Promise with updated blog post
   */
  async updateBlog(id: string, blogData: UpdateBlogData): Promise<BlogResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(blogData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update blog');
      }

      return data;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  /**
   * Delete a blog post
   * @param id - Blog ID
   * @returns Promise with deletion result
   */
  async deleteBlog(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete blog');
      }

      return data;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }

  /**
   * Get admin's blog posts
   * @param page - Page number
   * @param limit - Items per page
   * @returns Promise with admin's blog posts
   */
  async getAdminBlogs(page: number = 1, limit: number = 10): Promise<BlogResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blogs/admin/my-blogs?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch admin blogs');
      }

      return data;
    } catch (error) {
      console.error('Error fetching admin blogs:', error);
      throw error;
    }
  }
}

export const blogService = new BlogService();
