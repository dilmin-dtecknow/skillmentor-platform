import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { createSubject, getPublicMentors } from "@/lib/api";
import type { Mentor } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AlertMessage from "@/components/AlertMessage";

export default function CreateSubjectPage() {
  const { getToken } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [form, setForm] = useState({
    subjectName: "",
    description: "",
    courseImageUrl: "",
    mentorId: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getPublicMentors()
      .then((data) => setMentors(data.content))
      .catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const checkRequiredFields = () => {
    if (form.subjectName.trim() === "") {
      setErrorMessage("Subject name is required");
      return false;
    }
    if (form.description.trim() === "") {
      setErrorMessage("Description is required");
      return false;
    }
    if (form.mentorId.trim() === "") {
      setErrorMessage("Mentor selection is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    try {
      const token = await getToken({ template: "skill-mentor" });
      if (!token) throw new Error("No token found");

      if (!checkRequiredFields()) return;

      // const res = await fetch("http://localhost:8080/api/v1/subjects", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     subjectName: form.subjectName,
      //     description: form.description,
      //     courseImageUrl: form.courseImageUrl,
      //     mentorId: Number(form.mentorId),
      //   }),
      // });

      // const data = await res.json().catch(() => null);
      const data = await createSubject(token, {
        subjectName: form.subjectName,
        description: form.description,
        courseImageUrl: form.courseImageUrl,
        mentorId: Number(form.mentorId),
      });

      if (!data.res.ok) throw new Error(data?.message || "Failed to create subject");

      setSuccessMessage(data?.message || "Subject created successfully!");
      setForm({
        subjectName: "",
        description: "",
        courseImageUrl: "",
        mentorId: "",
      });
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create subject",
      );
      // alert("
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Subject</h1>

      <div className="space-y-3 mb-4">
        <AlertMessage type="success" message={successMessage} />
        <AlertMessage type="error" message={errorMessage} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
        <div className="space-y-2">
          <Label>Subject Name</Label>
          <Input
            name="subjectName"
            value={form.subjectName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-md border p-3"
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Course Image URL</Label>
          <Input
            name="courseImageUrl"
            value={form.courseImageUrl}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Select Mentor</Label>
          <select
            name="mentorId"
            value={form.mentorId}
            onChange={handleChange}
            className="w-full rounded-md border p-3"
            required
          >
            <option value="">Choose mentor</option>
            {mentors.map((mentor) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.firstName} {mentor.lastName}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit">Create Subject</Button>
      </form>
    </div>
  );
}
