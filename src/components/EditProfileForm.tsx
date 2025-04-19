import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

type ProfileFormData = {
  name: string;
  department: string;
  graduationYear: number;
  skills: string[];
};

type EditProfileFormProps = {
  profile: any;
  onCancel: () => void;
};

export function EditProfileForm({ profile, onCancel }: EditProfileFormProps) {
  const editProfile = useMutation(api.users.editProfile);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(profile.skills || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: profile.name,
      department: profile.department,
      graduationYear: profile.graduationYear,
      skills: profile.skills,
    },
  });

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await editProfile({
        ...data,
        skills,
        graduationYear: Number(data.graduationYear),
      });
      toast.success("Profile updated successfully!");
      onCancel();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto border border-gray-200">
      <div>
        <label className="block text-base font-semibold text-gray-800 mb-1">Name</label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition px-4 py-2 text-base"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 font-medium">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-base font-semibold text-gray-800 mb-1">Department</label>
        <input
          type="text"
          {...register("department", { required: "Department is required" })}
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition px-4 py-2 text-base"
        />
        {errors.department && (
          <p className="mt-1 text-sm text-red-600 font-medium">
            {errors.department.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-base font-semibold text-gray-800 mb-1">Graduation Year</label>
        <input
          type="number"
          {...register("graduationYear", {
            required: "Graduation year is required",
            min: {
              value: 2020,
              message: "Graduation year must be 2020 or later",
            },
          })}
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition px-4 py-2 text-base"
        />
        {errors.graduationYear && (
          <p className="mt-1 text-sm text-red-600 font-medium">
            {errors.graduationYear.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-base font-semibold text-gray-800 mb-1">Skills</label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition px-4 py-2 text-base"
            placeholder="Add a skill"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            Add
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600 focus:outline-none"
                aria-label={`Remove ${skill}`}
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-5 py-2 border border-gray-300 text-base font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-5 py-2 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}