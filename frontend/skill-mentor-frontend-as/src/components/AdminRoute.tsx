import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { isAdminFromToken } from "@/lib/auth";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkRole() {
      if (!isLoaded || !isSignedIn) return;
      const admin = await isAdminFromToken(getToken);
      setIsAdmin(admin);
    }

    checkRole();
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) return <div className="container py-10">Loading...</div>;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  if (isAdmin === null) return <div className="container py-10">Checking access...</div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}