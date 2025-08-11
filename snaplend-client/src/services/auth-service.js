// services/auth-service.js

const STORAGE_KEY = 'user'; // localStorage key for storing the user object

const AuthService = {
  /**
   * Save the logged-in user to localStorage.
   * @param {Object} user - The user object returned from the login API (including token, email, displayName).
   */
  onLogin(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
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
    const user = localStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
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
    return !!this.getToken();
  },
};

export default AuthService;
