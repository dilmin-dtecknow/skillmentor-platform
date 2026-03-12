import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AlertMessage from "@/components/AlertMessage";
import { createMentor } from "@/lib/api";

export default function CreateMentorPage() {
  const { getToken } = useAuth();

  const [form, setForm] = useState({
    mentorId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    title: "",
    profession: "",
    company: "",
    experienceYears: "",
    bio: "",
    profileImageUrl: "",
    isCertified: false,
    startYear: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const checkRequiredFields = () => {
    if (form.mentorId.trim() === "") {
      setErrorMessage("Mentor ID is required");
      return false;
    }
    if (form.firstName.trim() === "") {
      setErrorMessage("First name is required");
      return false;
    }
    if (form.lastName.trim() === "") {
      setErrorMessage("Last name is required");
      return false;
    }
    if (form.email.trim() === "") {
      setErrorMessage("Email is required");
      return false;
    }
    if (form.title.trim() === "") {
      setErrorMessage("Title is required");
      return false;
    }
    if (form.profession.trim() === "") {
      setErrorMessage("Profession is required");
      return false;
    }
    if (form.experienceYears.trim() === "") {
      setErrorMessage("Experience years is required");
      return false;
    }
    if (form.bio.trim() === "") {
      setErrorMessage("Bio is required");
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

      // const res = await fetch("http://localhost:8080/api/v1/mentors", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     ...form,
      //     experienceYears: Number(form.experienceYears),
      //   }),
      // });

      // const data = await res.json().catch(() => null);
      const data = await createMentor(token, {
        ...form,
        experienceYears: Number(form.experienceYears),
      });

      if (!data.res.ok) throw new Error(data?.message || "Failed to create mentor");

      // alert("Mentor created successfully!");
      setSuccessMessage(data?.message || "Mentor created successfully!");
    } catch (error) {
      console.error(error);
      // alert("Failed to create mentor");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create mentor",
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Mentor</h1>

      <div className="space-y-3 mb-4">
        <AlertMessage type="success" message={successMessage} />
        <AlertMessage type="error" message={errorMessage} />
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Mentor ID</Label>
          <Input
            name="mentorId"
            value={form.mentorId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>First Name</Label>
          <Input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Title</Label>
          <Input name="title" value={form.title} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Profession</Label>
          <Input
            name="profession"
            value={form.profession}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Company</Label>
          <Input name="company" value={form.company} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Experience Years</Label>
          <Input
            name="experienceYears"
            type="number"
            value={form.experienceYears}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Profile Image URL</Label>
          <Input
            name="profileImageUrl"
            value={form.profileImageUrl}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Start Year</Label>
          <Input
            name="startYear"
            value={form.startYear}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center gap-2 mt-8">
          <input
            type="checkbox"
            name="isCertified"
            checked={form.isCertified}
            onChange={handleChange}
          />
          <Label>Is Certified</Label>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Bio</Label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full rounded-md border p-3"
            rows={5}
          />
        </div>

        <div className="md:col-span-2">
          <Button type="submit">Create Mentor</Button>
        </div>
      </form>
    </div>
  );
}
