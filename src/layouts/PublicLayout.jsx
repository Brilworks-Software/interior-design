import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import useDesignerStore from "../store/useDesignerStore";
import SignupModal from "../components/SignupModal";
import LoginPrompt from "../components/Designer/LoginPrompt";

export default function PublicLayout() {
  const showSignupModal = useDesignerStore((s) => s.showSignupModal);
  const signupModalClosable = useDesignerStore((s) => s.signupModalClosable);
  const signupModalType = useDesignerStore((s) => s.signupModalType);
  const setShowSignupModal = useDesignerStore((s) => s.setShowSignupModal);

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
      <div style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}
