/**
 * Token Manager - Secure token storage utilities
 * 
 * Security Best Practices:
 * 1. RECOMMENDED: Use httpOnly cookies (requires backend support)
 *    - Cannot be accessed by JavaScript (XSS protection)
 *    - Automatically sent with requests
 *    - Set Secure flag for HTTPS only
 *    - Set SameSite flag for CSRF protection
 * 
 * 2. ALTERNATIVE: localStorage (current implementation)
 *    - Vulnerable to XSS attacks
 *    - Easy to implement
 *    - Good for development/testing
 */

// Current implementation using localStorage
// TODO: Migrate to httpOnly cookies in production

export const TokenManager = {
  /**
   * Store authentication token
   * @param token - JWT access token
   */
  setToken: (token: string): void => {
    try {
      localStorage.setItem('authToken', token);
      console.log('🔐 Token stored securely');
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  /**
   * Retrieve authentication token
   * @returns token or null if not found
   */
  getToken: (): string | null => {
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  /**
   * Remove authentication token (logout)
   */
  removeToken: (): void => {
    try {
      localStorage.removeItem('authToken');
      console.log('🔓 Token removed');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!TokenManager.getToken();
  },

  /**
   * Get token expiration time (if JWT)
   */
  getTokenExpiration: (): Date | null => {
    const token = TokenManager.getToken();
    if (!token) return null;

    try {
      // Decode JWT payload (middle part)
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        return new Date(payload.exp * 1000); // Convert Unix timestamp to Date
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
    return null;
  },

  /**
   * Check if token is expired
   */
  isTokenExpired: (): boolean => {
    const expiration = TokenManager.getTokenExpiration();
    if (!expiration) return true;
    return expiration < new Date();
  },
};

/**
 * PRODUCTION RECOMMENDATION:
 * 
 * Implement httpOnly cookies on your backend:
 * 
 * Backend (C# ASP.NET Core):
 * ```csharp
 * // In your login endpoint
 * Response.Cookies.Append("authToken", token, new CookieOptions
 * {
 *     HttpOnly = true,      // Cannot be accessed via JavaScript
 *     Secure = true,        // Only sent over HTTPS
 *     SameSite = SameSiteMode.Strict, // CSRF protection
 *     Expires = DateTimeOffset.UtcNow.AddHours(1)
 * });
 * ```
 * 
 * Frontend (axios config):
 * ```typescript
 * axios.create({
 *   baseURL: 'http://localhost:5000/api',
 *   withCredentials: true, // Send cookies with requests
 * });
 * ```
 * 
 * Then you don't need to manually manage tokens in localStorage!
 */
