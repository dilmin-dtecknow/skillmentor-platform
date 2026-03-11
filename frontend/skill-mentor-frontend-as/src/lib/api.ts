import type { Enrollment, Mentor } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

async function fetchWithAuth(
  endpoint: string,
  token: string,
  options: RequestInit = {},
): Promise<Response> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res;
}

// Public route without auth
export async function getPublicMentors(
  page = 0,
  size = 10,
): Promise<{ content: Mentor[]; totalElements: number; totalPages: number }> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/mentors?page=${page}&size=${size}`,
  );
  if (!res.ok) throw new Error("Failed to fetch mentors");
  return res.json();
}

//Mentor profile route with auth
export async function getMentorProfile(mentorId: string): Promise<Mentor> {
  const res = await fetch(`${API_BASE_URL}/api/v1/mentors/${mentorId}`);
  if (!res.ok) throw new Error("Failed to fetch mentor profile");
  const data = await res.json();
  return data.data ?? data;
}

// Enrollments
export async function enrollInSession(
  token: string,
  data: {
    mentorId: number;
    subjectId: number;
    sessionAt: string;
    durationMinutes?: number;
  },
): Promise<Enrollment> {
  const res = await fetchWithAuth("/api/v1/sessions/enroll", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMyEnrollments(token: string): Promise<Enrollment[]> {
  const res = await fetchWithAuth("/api/v1/sessions/my-sessions", token);
  return res.json();
}

export async function createSubject(
  token: string,
  data: {
    subjectName: string;
    description: string;
    courseImageUrl: string;
    mentorId: number;
  },
) {
  const res = await fetchWithAuth("/api/v1/subjects", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function createMentor(token: string, data: Record<string, unknown>) {
  const res = await fetchWithAuth("/api/v1/mentors", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getAllBookings(
  token: string,
  page = 0,
  size = 5,
): Promise<{
  content: Enrollment[];
  totalPages: number;
  totalElements: number;
  number: number;
}> {
  const res = await fetchWithAuth(
    `/api/v1/sessions?page=${page}&size=${size}`,
    token,
  );
  return res.json();
}

export async function confirmPayment(token: string, id: number) {
  const res = await fetchWithAuth(`/api/v1/sessions/${id}/confirm-payment`, token, {
    method: "PATCH",
  });
  return res.json();
}

export async function markSessionComplete(token: string, id: number) {
  const res = await fetchWithAuth(`/api/v1/sessions/${id}/complete`, token, {
    method: "PATCH",
  });
  return res.json();
}

export async function addMeetingLink(
  token: string,
  id: number,
  meetingLink: string,
) {
  const res = await fetchWithAuth(
    `/api/v1/sessions/${id}/meeting-link?meetingLink=${encodeURIComponent(meetingLink)}`,
    token,
    {
      method: "PATCH",
    },
  );
  return res.json();
}

export async function addReview(
  token: string,
  id: number,
  review: string,
  rating: number,
) {
  const res = await fetchWithAuth(
    `/api/v1/sessions/${id}/review?review=${encodeURIComponent(review)}&rating=${rating}`,
    token,
    {
      method: "PATCH",
    },
  );
  return res.json();
}