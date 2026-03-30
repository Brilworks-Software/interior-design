import api from "./api";

export const referralService = {
  /**
   * Get referral code from URL or localStorage
   */
  getReferralCode() {
    // Check URL first
    const params = new URLSearchParams(window.location.search);
    const urlRef = params.get("ref");

    if (urlRef) {
      // Store in localStorage for later
      localStorage.setItem("referral_code", urlRef);
      return urlRef;
    }

    // Fall back to localStorage
    return localStorage.getItem("referral_code");
  },

  /**
   * Store referral code from URL (called on page load)
   */
  captureReferralCode() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      localStorage.setItem("referral_code", ref);
      return ref;
    }

    return null;
  },

  /**
   * Clear stored referral code
   */
  clearReferralCode() {
    localStorage.removeItem("referral_code");
  },

  /**
   * Register a signup with referral code
   */
  async registerWithReferral(userId, referralCode) {
    if (!referralCode || !userId) {
      return null;
    }

    try {
      const { data } = await api.post("/referral/register-with-referral", {
        userId,
        referralCode,
      });
      return data;
    } catch (error) {
      console.warn("Failed to register referral:", error);
      return null;
    }
  },

  /**
   * Track user login if they were referred
   */
  async trackLogin() {
    try {
      const { data } = await api.post("/referral/track-login");
      return data;
    } catch (error) {
      console.warn("Failed to track login:", error);
      return null;
    }
  },

  /**
   * Make current user an affiliate
   */
  async becomeAffiliate() {
    try {
      const { data } = await api.post("/referral/become-affiliate");
      return data;
    } catch (error) {
      console.error("Failed to become affiliate:", error);
      throw error;
    }
  },

  /**
   * Get affiliate information and stats
   */
  async getAffiliateInfo() {
    try {
      const { data } = await api.get("/referral/affiliate-info");
      return data;
    } catch (error) {
      console.error("Failed to fetch affiliate info:", error);
      throw error;
    }
  },

  /**
   * Copy referral link to clipboard
   */
  async copyReferralLink(referralUrl) {
    try {
      await navigator.clipboard.writeText(referralUrl);
      return true;
    } catch (error) {
      console.error("Failed to copy referral link:", error);
      return false;
    }
  },
};
