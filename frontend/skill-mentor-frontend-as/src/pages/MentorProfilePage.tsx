import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getMentorProfile } from "@/lib/api";

import { SchedulingModal } from "@/components/SchedulingModel";
import type { Mentor } from "@/types";
// interface Subject {
//   id: number;
//   subjectName: string;
//   description: string;
//   courseImageUrl?: string;
//   enrollmentCount?: number;
// }

// interface MentorProfile {
//   id: number;
//   firstName: string;
//   lastName: string;
//   title?: string;
//   profession?: string;
//   company?: string;
//   bio?: string;
//   profileImageUrl?: string;
//   isCertified?: boolean;
//   startYear?: string;
//   experienceYears?: number;
//   averageRating?: number;
//   reviewCount?: number;
//   subjects?: Subject[];
// }

export default function MentorProfilePage() {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);

  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<
    number | undefined
  >();

  // useEffect(() => {
  //   async function fetchMentor() {
  //     try {
  //       const res = await fetch(`http://localhost:8080/api/v1/mentors/${mentorId}`);
  //       if (!res.ok) throw new Error("Failed to fetch mentor");
  //       const data = await res.json();
  //       setMentor(data.data ?? data);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchMentor();
  // }, [mentorId]);

  useEffect(() => {
    async function fetchMentor() {
      try {
        if (!mentorId) return;
        const data = await getMentorProfile(mentorId);
        setMentor(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMentor();
  }, [mentorId]);

  if (loading) return <div className="container py-10">Loading mentor...</div>;
  if (!mentor) return <div className="container py-10">Mentor not found</div>;

  return (
    <div className="container py-10 space-y-8">
      <Link to="/">
        <Button variant="outline">Back to Mentors</Button>
      </Link>

      <div className="grid gap-8 md:grid-cols-[220px_1fr] items-start">
        <div className="rounded-2xl overflow-hidden border">
          {mentor.profileImageUrl ? (
            <img
              src={mentor.profileImageUrl}
              alt={`${mentor.firstName} ${mentor.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="aspect-square bg-muted flex items-center justify-center text-4xl font-bold">
              {mentor.firstName?.charAt(0)}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold">
            {mentor.firstName} {mentor.lastName}
          </h1>

          <p className="text-lg text-muted-foreground">
            {mentor.title} {mentor.company ? `• ${mentor.company}` : ""}
          </p>

          <p className="text-muted-foreground">{mentor.profession}</p>

          {mentor.isCertified && (
            <span className="inline-block rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm">
              Certified Mentor
            </span>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="text-xl font-semibold">
                {mentor.experienceYears ?? 0} years
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Rating</p>
              <p className="text-xl font-semibold">
                {mentor.averageRating ?? 0} ({mentor.reviewCount ?? 0} reviews)
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Since</p>
              <p className="text-xl font-semibold">
                {mentor.startYear ?? "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">About</h2>
        <p className="text-muted-foreground">
          {mentor.bio || "No bio available."}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Subjects Taught</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mentor.subjects?.map((subject) => (
            <div
              key={subject.id}
              className="rounded-2xl border overflow-hidden"
            >
              {subject.courseImageUrl && (
                <img
                  src={subject.courseImageUrl}
                  alt={subject.subjectName}
                  className="w-full h-44 object-cover"
                />
              )}
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">{subject.subjectName}</h3>
                <p className="text-sm text-muted-foreground">
                  {subject.description}
                </p>
                <p className="text-sm font-medium">
                  {subject.enrollmentCount ?? 0} students enrolled
                </p>

                <Button
                  className="w-full"
                  onClick={() => {
                    setSelectedSubjectId(subject.id);
                    setIsSchedulingModalOpen(true);
                  }}
                >
                  Book Session
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scheduling Modal */}
      {mentor && (
        <SchedulingModal
          isOpen={isSchedulingModalOpen}
          onClose={() => setIsSchedulingModalOpen(false)}
          mentor={mentor as never}
          selectedSubjectId={selectedSubjectId}
        />
      )}
    </div>
  );
}
