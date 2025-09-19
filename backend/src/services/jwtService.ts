import jwt from 'jsonwebtoken';

/**
 * JWT service for admin authentication
 */
class JWTService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-here';
    this.expiresIn = process.env['JWT_EXPIRES_IN'] || '7d';
  }

  /**
   * Generate JWT token for admin
   * @param adminId - Admin ID
   * @param username - Admin username
   * @param role - Admin role
   * @returns JWT token
   */
  generateToken(adminId: string, username: string, role: string): string {
    const payload = {
      adminId,
      username,
      role,
      type: 'admin'
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
      issuer: 'agevaa-admin'
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   * @param token - JWT token to verify
   * @returns Decoded token payload
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Decode JWT token without verification (for debugging)
   * @param token - JWT token to decode
   * @returns Decoded token payload
   */
  decodeToken(token: string): any {
    return jwt.decode(token);
  }

  /**
   * Extract token from Authorization header
   * @param authHeader - Authorization header value
   * @returns Token string or null
   */
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

export const jwtService = new JWTService();
