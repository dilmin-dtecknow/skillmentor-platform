import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { CalendarDays } from "lucide-react";
import { StatusPill } from "@/components/StatusPill";
import { getMyEnrollments } from "@/lib/api";
import type { Enrollment } from "@/types";
import { useNavigate } from "react-router-dom";
import { isAdminFromToken } from "@/lib/auth";

import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/hooks/use-toast";
import { addReview } from "@/lib/api";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const { toast } = useToast();

  const handleSubmitReview = async (sessionId: number) => {
    try {
      const token = await getToken({ template: "skill-mentor" });
      if (!token) throw new Error("No token found");

      await addReview(token, sessionId, reviewText, reviewRating);

      toast({
        title: "Review submitted",
        description: "Your review was submitted successfully.",
      });

      setReviewingId(null);
      setReviewText("");
      setReviewRating(5);

      const refreshed = await getMyEnrollments(token);
      setEnrollments(refreshed);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    async function initPage() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        navigate("/login", { replace: true });
        return;
      }

      const admin = await isAdminFromToken(getToken);

      if (admin) {
        navigate("/admin/bookings", { replace: true });
        return;
      }

      try {
        setLoading(true);

        const token = await getToken({ template: "skill-mentor" });

        // console.log("Clerk token:", token);
        if (!token) {
          console.error("No Clerk token found");
          setLoading(false);
          return;
        }

        const data = await getMyEnrollments(token);
        setEnrollments(data);
      } catch (err) {
        console.error("Failed to fetch enrollments", err);
      } finally {
        setLoading(false);
      }
    }

    initPage();
  }, [isLoaded, isSignedIn, getToken, navigate]);

  if (!isLoaded || loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!enrollments.length) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-6">My Courses</h1>
        <p className="text-muted-foreground">No courses enrolled yet.</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Courses</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment.id}
            className="rounded-2xl p-6 relative overflow-hidden bg-linear-to-br from-blue-500 to-blue-600"
          >
            <div className="absolute top-4 right-4">
              <StatusPill status={enrollment.paymentStatus} />
            </div>

            <div className="size-24 rounded-full bg-white/10 mb-4">
              {enrollment.mentorProfileImageUrl ? (
                <img
                  src={enrollment.mentorProfileImageUrl}
                  alt={enrollment.mentorName}
                  className="w-full h-full rounded-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {enrollment.mentorName.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">
                {enrollment.subjectName}
              </h2>
              <p className="text-blue-100/80">
                Mentor: {enrollment.mentorName}
              </p>
              <div className="flex items-center text-blue-100/80 text-sm mt-2">
                <CalendarDays className="mr-2 h-4 w-4" />
                Next Session:{" "}
                {new Date(enrollment.sessionAt).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {enrollment.sessionStatus === "COMPLETED" &&
                !enrollment.studentReview && (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() =>
                      setReviewingId((prev) =>
                        prev === enrollment.id ? null : enrollment.id,
                      )
                    }
                  >
                    Write Review
                  </Button>
                )}

              {enrollment.studentReview && (
                <div className="rounded-xl bg-white/10 p-3 text-white">
                  <p className="text-sm font-medium">Your Review</p>
                  <p className="text-sm mt-1">{enrollment.studentReview}</p>
                  <p className="text-xs mt-2">
                    Rating: {enrollment.studentRating}/5
                  </p>
                </div>
              )}

              {reviewingId === enrollment.id && (
                <div className="rounded-xl bg-white/10 p-3 space-y-3">
                  <div>
                    <label className="text-sm text-white">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full mt-1 rounded-md border p-2 text-black"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Bad</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-white">Review</label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={3}
                      className="w-full mt-1 rounded-md border p-2 text-black"
                      placeholder="Write your feedback..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="w-full"
                      onClick={() => handleSubmitReview(enrollment.id)}
                      disabled={!reviewText.trim()}
                    >
                      Submit Review
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setReviewingId(null);
                        setReviewText("");
                        setReviewRating(5);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
