import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <div className="container py-10">Loading...</div>;
  if (!isSignedIn) return <Navigate to="/login" replace />;

  return <>{children}</>;
}