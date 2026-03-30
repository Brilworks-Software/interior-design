import { Component, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import RoomSelector from "./components/RoomSelector/RoomSelector";
import DesignerLayout from "./components/Designer/DesignerLayout";
import CustomRoomWizard from "./components/CustomBuilder/CustomRoomWizard";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { useAuthStore } from "./store/useAuthStore";
import { referralService } from "./services/referral.service";
import { AffiliatePage } from "./components/Designer/AffiliateIntegration";
import ResourcesPage from "./pages/ResourcesPage";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 32,
            background: "#1a1a1a",
            color: "#f87171",
            fontFamily: "monospace",
            height: "100vh",
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Render Error</h2>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
            {this.state.error.message}
          </pre>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: 11,
              color: "#9ca3af",
              marginTop: 12,
            }}
          >
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <RoomSelector /> },
      { path: "custom", element: <CustomRoomWizard /> },
      { path: "affiliate", element: <AffiliatePage /> },
      { path: "resources/:resource", element: <ResourcesPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginForm /> },
      { path: "register", element: <RegisterForm /> },
      { path: "signup", element: <RegisterForm /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <PrivateLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "design", element: <DesignerLayout /> }],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  useEffect(() => {
    // Capture referral code from URL on app load
    referralService.captureReferralCode();
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
    </ErrorBoundary>
  );
}
