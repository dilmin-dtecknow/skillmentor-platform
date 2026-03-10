// Modified to match with backend SubjectResponseDTO
export interface Subject {
  id: number;
  subjectName: string;
  description: string;
  courseImageUrl: string;
  enrollmentCount?: number;
}

// Modified to match with backend MentorResponseDTO (from GET /api/v1/mentors)
export interface Mentor {
  id: number;
  mentorId: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  profession: string;
  company: string;
  experienceYears: number;
  bio: string;
  profileImageUrl: string;
  positiveReviews: number;
  totalEnrollments: number;
  isCertified: boolean;
  startYear: string;
  averageRating?: number;
  reviewsCount?: number;
  subjects: Subject[];
}

// Modified to match with SessionResponseDTO (from GET /api/v1/sessions/my-sessions)
export interface Enrollment {
  id: number;
  studentName?: string;
  studentEmail?: string;
  mentorName: string;
  mentorProfileImageUrl: string;
  subjectName: string;
  sessionAt: string;
  durationMinutes: number;
  sessionStatus: string;
  paymentStatus: "pending" | "accepted" | "completed" | "cancelled";
  meetingLink: string | null;
  studentReview?: string | null;
  studentRating?: number | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
