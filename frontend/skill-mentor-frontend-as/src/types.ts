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
  reviewCount?: number;
  subjects: Subject[];
  reviews?: Review[];
  subjectsCount?: number;
  positiveReviewPercentage?: number;
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
  paymentStatus: "pending" | "confirmed" | "completed" | "cancelled";
  meetingLink: string | null;
  studentReview?: string | null;
  studentRating?: number | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Review {
  sessionId: number;
  studentName: string;
  review: string;
  rating: number;
  sessionAt: string;
}
