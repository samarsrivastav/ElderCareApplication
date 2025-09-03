import { User, IUser } from '../models/User';

/**
 * Repository class for User model operations
 */
export class UserRepository {
  /**
   * Find user by ID
   * @param id - User ID
   * @returns Promise<IUser | null>
   */
  async findById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id).select('+password');
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error}`);
    }
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns Promise<IUser | null>
   */
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email }).select('+password');
    } catch (error) {
      throw new Error(`Error finding user by email: ${error}`);
    }
  }

  /**
   * Create new user
   * @param userData - User data object
   * @returns Promise<IUser>
   */
  async create(userData: any): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }

  /**
   * Update user by ID
   * @param id - User ID
   * @param updateData - Update data object
   * @returns Promise<IUser | null>
   */
  async updateById(id: string, updateData: any): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  /**
   * Delete user by ID
   * @param id - User ID
   * @returns Promise<boolean>
   */
  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }

  /**
   * Find all users with pagination and filtering
   * @param options - Query options
   * @returns Promise<{ users: IUser[]; total: number; page: number; limit: number }>
   */
  async findAll(options: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
  } = {}): Promise<{ users: IUser[]; total: number; page: number; limit: number }> {
    try {
      const { page = 1, limit = 10, role, isActive, search } = options;
      const skip = (page - 1) * limit;

      // Build query
      const query: any = {};
      if (role) query.role = role;
      if (isActive !== undefined) query.isActive = isActive;
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        User.countDocuments(query)
      ]);

      return {
        users,
        total,
        page,
        limit
      };
    } catch (error) {
      throw new Error(`Error finding users: ${error}`);
    }
  }

  /**
   * Update user's last login
   * @param id - User ID
   * @returns Promise<void>
   */
  async updateLastLogin(id: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(id, { lastLogin: new Date() });
    } catch (error) {
      throw new Error(`Error updating last login: ${error}`);
    }
  }

  /**
   * Check if email exists
   * @param email - Email to check
   * @param excludeId - User ID to exclude from check
   * @returns Promise<boolean>
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    try {
      const query: any = { email };
      if (excludeId) {
        query._id = { $ne: excludeId };
      }
      const user = await User.findOne(query);
      return !!user;
    } catch (error) {
      throw new Error(`Error checking email existence: ${error}`);
    }
  }

  /**
   * Find users by role
   * @param role - User role
   * @returns Promise<IUser[]>
   */
  async findByRole(role: string): Promise<IUser[]> {
    try {
      return await User.find({ role, isActive: true }).select('-password');
    } catch (error) {
      throw new Error(`Error finding users by role: ${error}`);
    }
  }
}
