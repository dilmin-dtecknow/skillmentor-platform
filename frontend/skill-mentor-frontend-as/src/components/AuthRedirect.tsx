import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser, useAuth } from "@clerk/clerk-react";

export default function AuthRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate("/login", { replace: true });
      return;
    }

    const role = user?.publicMetadata?.role;
    if (role === "admin") {
      navigate("/admin/bookings", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  return <div className="container py-10">Redirecting...</div>;
}