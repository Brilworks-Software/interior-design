import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <Outlet />
    </div>
  );
}
