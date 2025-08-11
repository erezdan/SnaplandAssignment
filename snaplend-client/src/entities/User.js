export class User {
    static async me() {
      const response = await fetch("/api/users/me", {
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Not authenticated");
      }
  
      return await response.json();
    }
  
    static async login(credentials) {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Login failed");
      }
  
      return await response.json();
    }
  
    static async logout() {
      const response = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Logout failed");
      }
    }
  }
  