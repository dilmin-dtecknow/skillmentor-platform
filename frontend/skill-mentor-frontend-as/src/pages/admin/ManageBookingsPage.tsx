import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import AlertMessage from "@/components/AlertMessage";

import {
  addMeetingLink,
  confirmPayment,
  getAllBookings,
  markSessionComplete,
} from "@/lib/api";
import { Input } from "@/components/ui/input";

interface Booking {
  id: number;
  studentName?: string;
  studentEmail?: string;
  mentorName: string;
  subjectName: string;
  sessionAt: string;
  durationMinutes: number;
  paymentStatus: string;
  sessionStatus: string;
  meetingLink?: string | null;
}

export default function ManageBookingsPage() {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [meetingLinkValue, setMeetingLinkValue] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async (page = 0) => {
    try {
      setErrorMessage("");
      const token = await getToken({ template: "skill-mentor" });
      if (!token) throw new Error("No token found");

      const data = await getAllBookings(token, page, 5);
      setBookings(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number + 1);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to fetch bookings",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (
    id: number,
    action: "confirm-payment" | "complete",
  ) => {
    try {
      setSuccessMessage("");
      setErrorMessage("");

      const token = await getToken({ template: "skill-mentor" });
      if (!token) throw new Error("No token found");

      if (action === "confirm-payment") {
        await confirmPayment(token, id);
        setSuccessMessage("Payment confirmed successfully!");
      } else {
        await markSessionComplete(token, id);
        setSuccessMessage("Session marked as completed!");
      }

      fetchBookings();
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Action failed");
    }
  };

  const handleAddMeetingLink = async () => {
    try {
      if (!selectedBookingId || !meetingLinkValue.trim()) {
        throw new Error("Please enter a meeting link");
      }

      setSuccessMessage("");
      setErrorMessage("");

      const token = await getToken({ template: "skill-mentor" });
      if (!token) throw new Error("No token found");

      await addMeetingLink(token, selectedBookingId, meetingLinkValue);

      setSuccessMessage("Meeting link added successfully!");
      setMeetingLinkValue("");
      setSelectedBookingId(null);
      fetchBookings();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to add meeting link",
      );
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const q = searchTerm.toLowerCase();
    return (
      booking.studentName?.toLowerCase().includes(q) ||
      booking.mentorName?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>

      <div className="space-y-3 mb-4">
        <AlertMessage type="success" message={successMessage} />
        <AlertMessage type="error" message={errorMessage} />
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search by student or mentor name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl overflow-hidden">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Student</th>
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
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="p-3">{booking.id}</td>
                <td className="p-3">{booking.studentName ?? "N/A"}</td>
                <td className="p-3">{booking.mentorName ?? "N/A"}</td>
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedBookingId(booking.id)}
                  >
                    Add Meeting Link
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => fetchBookings(currentPage - 2)}
              className="cursor-pointer"
            >
              Previous
            </Button>

            <span className="flex items-center px-3 text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => fetchBookings(currentPage)}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        )}

        {selectedBookingId && (
          <div className="mt-6 rounded-xl border p-4 space-y-3">
            <h2 className="font-semibold">Add Meeting Link</h2>
            <Input
              placeholder="Enter Google Meet / Zoom link"
              value={meetingLinkValue}
              onChange={(e) => setMeetingLinkValue(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddMeetingLink}>Save Link</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedBookingId(null);
                  setMeetingLinkValue("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
