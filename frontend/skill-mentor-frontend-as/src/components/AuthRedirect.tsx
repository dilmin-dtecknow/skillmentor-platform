import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { getRoleFromToken } from "@/lib/auth";

export default function AuthRedirect() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function handleRedirect() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        navigate("/login", { replace: true });
        return;
      }

      const role = await getRoleFromToken(getToken);

      if (role === "admin") {
        navigate("/admin/bookings", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }

    handleRedirect();
  }, [isLoaded, isSignedIn, getToken, navigate]);

  return <div className="container py-10">Redirecting...</div>;
}