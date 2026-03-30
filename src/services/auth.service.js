import api, { tokenStorage } from "./api";
import { referralService } from "./referral.service";

export const authService = {
  /**
   * Login with email + password.
   * Returns { user } and stores access token in cookie.
   */
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    tokenStorage.set(data.accessToken);

    // Track login for referrals (fire and forget)
    referralService.trackLogin().catch(() => {});

    return data.user;
  },

  /**
   * Register with name + email + password.
   * Returns { user } and stores access token in cookie.
   */
  async register(name, email, password) {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    tokenStorage.set(data.accessToken);
    return data.user;
  },

  /**
   * Logout — clears token cookie and calls backend to invalidate session.
   */
  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      tokenStorage.remove();
    }
  },

  /**
   * Fetch current user from server using stored access token.
   * Called on every app load / hard refresh.
   * Returns user object or null.
   */
  async getMe() {
    const token = tokenStorage.get();
    if (!token) return null;
    try {
      const { data } = await api.get("/auth/me");
      return data;
    } catch {
      tokenStorage.remove();
      return null;
    }
  },
};
