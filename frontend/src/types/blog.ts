/**
 * Blog interface
 */
export interface Blog {
  _id: string;
  title: string;
  image: string;
  description: string;
  content: string;
  authorName: string;
  authorId: string;
  published: boolean;
  tags: string[];
  slug: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Blog creation interface
 */
export interface CreateBlogData {
  title: string;
  description: string;
  content: string;
  image: string; // Base64 image
  tags: string[];
  published: boolean;
}

/**
 * Blog update interface
 */
export interface UpdateBlogData {
  title?: string;
  description?: string;
  content?: string;
  image?: string;
  tags?: string[];
  published?: boolean;
}

/**
 * Blog API response interface
 */
export interface BlogResponse {
  success: boolean;
  message?: string;
  data: {
    blog?: Blog;
    blogs?: Blog[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

/**
 * Admin interface
 */
export interface Admin {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  lastLogin?: string;
}

/**
 * Admin login interface
 */
export interface AdminLoginData {
  username: string;
  password: string;
}

/**
 * Admin API response interface
 */
export interface AdminResponse {
  success: boolean;
  message?: string;
  data: {
    token?: string;
    admin?: Admin;
    contacts?: any[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}
