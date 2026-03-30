import { useState, useEffect } from "react";
import { postToSlack, formatUserLoginSlackMessage } from "../utils/slack";
import posthog from "posthog-js";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { referralService } from "../services/referral.service";

export default function SignupModal({ onComplete, onClose, closable = true }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !number.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Fetch IP Info
      const ipRes = await fetch("https://ipapi.co/json/").catch(() => null);
      let ipInfo = null;
      let ip = "";
      if (ipRes && ipRes.ok) {
        ipInfo = await ipRes.json();
        ip = ipInfo?.ip || "";
      }

      // 2. Register via Zustand Store (Supabase)
      let userId = null;
      try {
        const user = await signUp(number + "@interior.com", "defaultpass");
        userId = user?.id;
      } catch (err) {
        console.warn("Context auth failed, continuing", err);
      }

      // 3. Handle referral if user was registered and has a referral code
      if (userId) {
        const referralCode = referralService.getReferralCode();
        if (referralCode) {
          try {
            await referralService.registerWithReferral(userId, referralCode);
            console.log("Referral registered for code:", referralCode);
            // Clear the referral code after successful registration
            referralService.clearReferralCode();
          } catch (err) {
            console.warn("Failed to register referral:", err);
          }
        }
      }

      // 4. Format and Send to Slack
      const message = formatUserLoginSlackMessage({
        name,
        number,
        ip,
        ipInfo,
      });
      await postToSlack(message);

      // 5. Identify user in PostHog
      posthog.identify(number, {
        name: name,
        phone: number,
        ip: ip,
        city: ipInfo?.city,
        country: ipInfo?.country_name,
      });

      onComplete();
    } catch (error) {
      console.error(error);
      // Let them in anyway if API fails
      localStorage.setItem("has_signed_up_designs", "true");
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
      <div className="relative bg-white border border-gray-200 p-8 rounded-2xl max-w-md w-full shadow-2xl">
        {closable && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        )}
        <div className="mb-8 text-center pt-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Start Your 3D Room Design
          </h2>
          <p className="text-gray-500">
            Enter your details below to unlock the 3D designer and start
            creating your dream space.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary0 focus:border-primary0 transition-colors"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp / Phone Number
            </label>
            <input
              type="tel"
              required
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary0 focus:border-primary0 transition-colors"
              placeholder="+1 234 567 8900"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-secondary text-white font-medium rounded-lg px-4 py-3 mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? "Starting..." : "Start Designing"}
          </button>
        </form>
      </div>
    </div>
  );
}
