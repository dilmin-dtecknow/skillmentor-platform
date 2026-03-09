import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

interface Booking {
  id: number;
  mentorName: string;
  subjectName: string;
  sessionAt: string;
  durationMinutes: number;
  paymentStatus: string;
  sessionStatus: string;
  meetingLink?: string;
}

export default function ManageBookingsPage() {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = await getToken({ template: "skill-mentor" });
      if (!token) throw new Error("No token found");

      const res = await fetch("http://localhost:8080/api/v1/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: number, action: "confirm-payment" | "complete") => {
    try {
      const token = await getToken({ template: "skill-mentor" });
      if (!token) throw new Error("No token found");

      const res = await fetch(`http://localhost:8080/api/v1/sessions/${id}/${action}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to update booking");

      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Action failed");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl overflow-hidden">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Mentor</th>
              <th className="text-left p-3">Subject</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Duration</th>
              <th className="text-left p-3">Payment</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="p-3">{booking.id}</td>
                <td className="p-3">{booking.mentorName}</td>
                <td className="p-3">{booking.subjectName}</td>
                <td className="p-3">
                  {new Date(booking.sessionAt).toLocaleString()}
                </td>
                <td className="p-3">{booking.durationMinutes} min</td>
                <td className="p-3">{booking.paymentStatus}</td>
                <td className="p-3">{booking.sessionStatus}</td>
                <td className="p-3 flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => updateBooking(booking.id, "confirm-payment")}
                  >
                    Confirm Payment
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateBooking(booking.id, "complete")}
                  >
                    Mark Complete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}