// services/auth-service.js

const STORAGE_KEY = 'user'; // localStorage key for storing the user object

const AuthService = {
  /**
   * Save the logged-in user to localStorage.
   * @param {Object} user - The user object returned from the login API (including token, email, displayName).
   */
  onLogin(user) {
    console.log('AuthService.onLogin called with:', user);
    if (user && typeof user === 'object') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      console.log('User saved to localStorage:', JSON.stringify(user));
    } else {
      console.error('Invalid user data passed to onLogin:', user);
    }
  },

  /**
   * Remove the user from localStorage and perform logout.
   */
  onLogout() {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Get the currently logged-in user from localStorage.
   * @returns {Object|null} user object or null if not logged in.
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem(STORAGE_KEY);
      // Check if user exists and is not undefined/null/empty string
      if (user && user !== 'undefined' && user !== 'null' && user.trim() !== '') {
        return JSON.parse(user);
      }
      return null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // If there's an error parsing, remove the invalid data
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  /**
   * Get the authentication token for use in requests.
   * @returns {string|null} token or null if not logged in.
   */
  getToken() {
    const user = this.getCurrentUser();
    return user?.token || null;
  },

  /**
   * Check whether a user is currently logged in.
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  },
};

export default AuthService;
