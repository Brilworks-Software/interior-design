import { useEffect, useState } from "react";
import LoginPrompt from "./Designer/LoginPrompt";
import { useAuthStore } from "../store/useAuthStore";

const LAST_PROMPT_KEY = "lastLoginPrompt";
const PROMPT_COUNT_KEY = "loginPromptCount";
const TEN_MIN = 10 * 60 * 1000;

export default function GlobalLoginReminder() {
  const user = useAuthStore((s) => s.user);
  const [visible, setVisible] = useState(false);
  const [closable, setClosable] = useState(true);

  useEffect(() => {
    if (user) return; // no reminders when logged in

    function checkPrompt() {
      try {
        const last = Number(localStorage.getItem(LAST_PROMPT_KEY) || 0);
        const count = Number(localStorage.getItem(PROMPT_COUNT_KEY) || 0);
        const now = Date.now();
        if (!last || now - last >= TEN_MIN) {
          const nextCount = count + 1;
          localStorage.setItem(PROMPT_COUNT_KEY, String(nextCount));
          localStorage.setItem(LAST_PROMPT_KEY, String(now));
          // first time: closable, second+ time: not closable
          setClosable(nextCount <= 1);
          setVisible(true);
        }
      } catch (e) {
        console.warn("GlobalLoginReminder localStorage error", e);
      }
    }

    // Run once on mount then every minute to evaluate condition (avoid tight loops)
    checkPrompt();
    const interval = setInterval(checkPrompt, 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  if (user) return null;

  return visible ? (
    <LoginPrompt closable={closable} onClose={() => setVisible(false)} />
  ) : null;
}
