import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import type { ReactNode } from "react";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return <div className="container py-10">Loading...</div>;
  if (!isSignedIn) return <Navigate to="/login" replace />;

  const role = user?.publicMetadata?.role;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}