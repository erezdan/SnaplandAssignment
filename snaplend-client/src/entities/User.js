import AuthService from "../services/auth-service";

export class User {
  constructor(email, displayName) {
    this.email = email;
    this.displayName = displayName;
  }

  static me() {
    const data = AuthService.getCurrentUser();

    if (
      !data ||
      !data.email ||
      !data.displayName
    ) {
      return null;
    }

    return new User(data.email, data.displayName);
  }
}
