import { useState, useEffect } from 'react';
import { postToSlack, formatUserLoginSlackMessage } from '../utils/slack';
import posthog from 'posthog-js';

export default function SignupModal({ onComplete }) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !number.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Fetch IP Info
      const ipRes = await fetch('https://ipapi.co/json/').catch(() => null);
      let ipInfo = null;
      let ip = '';
      if (ipRes && ipRes.ok) {
        ipInfo = await ipRes.json();
        ip = ipInfo?.ip || '';
      }

      // 2. Format and Send to Slack
      const message = formatUserLoginSlackMessage({
        name,
        number,
        ip,
        ipInfo
      });
      await postToSlack(message);

      // 3. Identify user in PostHog
      posthog.identify(number, {
        name: name,
        phone: number,
        ip: ip,
        city: ipInfo?.city,
        country: ipInfo?.country_name
      });
      
      // Let the app know they signed up
      localStorage.setItem('has_signed_up_designs', 'true');
      onComplete();

    } catch (error) {
      console.error(error);
      // Let them in anyway if API fails
      localStorage.setItem('has_signed_up_designs', 'true');
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-left">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Interior Design Planner</h2>
          <p className="text-zinc-400">Please enter your details to start designing your dream room.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">WhatsApp / Phone Number</label>
            <input
              type="tel"
              required
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1 234 567 8900"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-3 mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Starting...' : 'Start Designing'}
          </button>
        </form>
      </div>
    </div>
  );
}
