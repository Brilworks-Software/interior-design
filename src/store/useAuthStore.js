import { create } from "zustand";
import { authService } from "../services/auth.service";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  error: null,

  /**
   * Called on every app load / hard refresh.
   * Hits GET /auth/me with the stored cookie access token.
   */
  initializeAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.getMe();
      set({ user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(email, password);
      set({ user, isLoading: false });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Login failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(name, email, password);
      set({ user, isLoading: false });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Registration failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Convenience alias used by the SignupModal component (keeps older code working)
  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    const inferredName = email?.split("@")?.[0] || "User";
    try {
      const user = await authService.register(inferredName, email, password);
      set({ user, isLoading: false });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Registration failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
    } finally {
      set({ user: null, isLoading: false });
    }
  },
}));
