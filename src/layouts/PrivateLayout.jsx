import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import useDesignerStore from "../store/useDesignerStore";
import Header from "../components/Header/Header";
import SignupModal from "../components/SignupModal";
import LoginPrompt from "../components/Designer/LoginPrompt";
import { useAuthStore } from "../store/useAuthStore";

export default function PrivateLayout() {
  const showSignupModal = useDesignerStore((s) => s.showSignupModal);
  const signupModalClosable = useDesignerStore((s) => s.signupModalClosable);
  const signupModalType = useDesignerStore((s) => s.signupModalType);
  const setShowSignupModal = useDesignerStore((s) => s.setShowSignupModal);
  const selectedRoom = useDesignerStore((s) => s.selectedRoom);
  const user = useAuthStore((s) => s.user);

  // Pseudo-auth: requires a selected room to be in this layout
  if (!selectedRoom) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    // If user is already authenticated, do nothing. If not authenticated,
    // show the signup modal after a short delay to encourage sign-up. We
    // intentionally no longer rely on the `has_signed_up_designs` localStorage
    // flag — gating is based purely on auth state now.
    if (user) return;

    const timer = setTimeout(() => {
      useDesignerStore.getState().setShowSignupModal(true, true);
    }, 90000);

    return () => clearTimeout(timer);
  }, [user]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Header />
      {showSignupModal &&
        (signupModalType === "prompt" ? (
          <LoginPrompt
            onClose={() => setShowSignupModal(false)}
            closable={signupModalClosable}
          />
        ) : (
          <SignupModal
            onComplete={() => setShowSignupModal(false)}
            onClose={() => setShowSignupModal(false)}
            closable={signupModalClosable}
          />
        ))}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
}
