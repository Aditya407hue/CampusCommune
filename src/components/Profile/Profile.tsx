import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Doc } from "convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  UserIcon,
  MailIcon,
  SettingsIcon,
  BellIcon,
  EyeIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  PhoneIcon,
  BuildingIcon,
  CalendarIcon,
  SaveIcon,
  ListChecksIcon,
} from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "convex/react";
import { api } from "./../../../convex/_generated/api";

interface ProfileProps {
  profile: Doc<"profiles"> & {
    email: string | undefined;
    phone: string | undefined;
  };
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
}

const Profile = ({ profile, isEditing = true, setIsEditing }: ProfileProps) => {
  const [activeItem, setActiveItem] = useState("Profile");
  const updateProfile = useMutation(api.profile.patch);

  // Form state
  const [formData, setFormData] = useState({
    name: profile.name || "",
    email: profile.email || "",
    // bio: profile.bio || "",
    department: profile.department || "",
    graduationYear: profile.graduationYear?.toString() || "",
    skills: profile.skills?.join(", ") || "",
    phone: profile.phone || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    // Here you would call your update mutation
    console.log("Saving profile data:", formData);
    if (setIsEditing) setIsEditing(false);
    // Add mutation call here
    updateProfile({
      name: formData.name,
      // bio: formData.bio,
      department: formData.department,
      graduationYear: +formData.graduationYear,
      role: profile.role,
      skills: formData.skills.split(","),
    });
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      formData.name,
      formData.email,
      // formData.bio,
      formData.department,
      formData.graduationYear,
      formData.skills,
      formData.phone,
    ];

    const filledFields = fields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateProfileCompletion();

  return (
    <div className="w-full py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Card */}
          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 h-24"></div>
            <div className="px-6 pb-6">
              <div className="relative flex justify-center">
                <div className="absolute -top-10 bg-white rounded-full border-4 border-white p-1">
                  <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-gray-400" />
                  </div>
                </div>
                <div className="mt-14 text-center">
                  <h3 className="text-lg font-semibold">
                    {profile.name || "Your Name"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {profile.role || "Student"} •{" "}
                    {profile.department || "Department"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="bg-gray-100 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-blue-500 h-2.5 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Profile completion: {completionPercentage}%
                </p>
              </div>
            </div>
          </Card>

          {/* Navigation Menu */}
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <nav className="space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${activeItem === "Profile" ? "bg-indigo-100 text-indigo-700 font-medium" : "text-muted-foreground hover:bg-gray-100"}`}
                  onClick={() => setActiveItem("Profile")}
                >
                  <UserIcon className="w-4 h-4" />
                  Profile Information
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${activeItem === "Account" ? "bg-indigo-100 text-indigo-700 font-medium" : "text-muted-foreground hover:bg-gray-100"}`}
                  onClick={() => setActiveItem("Account")}
                >
                  <SettingsIcon className="w-4 h-4" />
                  Account Settings
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${activeItem === "Appearance" ? "bg-indigo-100 text-indigo-700 font-medium" : "text-muted-foreground hover:bg-gray-100"}`}
                  onClick={() => setActiveItem("Appearance")}
                >
                  <EyeIcon className="w-4 h-4" />
                  Appearance
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${activeItem === "Notifications" ? "bg-indigo-100 text-indigo-700 font-medium" : "text-muted-foreground hover:bg-gray-100"}`}
                  onClick={() => setActiveItem("Notifications")}
                >
                  <BellIcon className="w-4 h-4" />
                  Notifications
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 overflow-scroll">
          <ScrollArea className="max-h-[calc(100vh-150px)]">
            <div className="space-y-6 pr-4">
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-indigo-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Update your personal details and how others will see you on
                    the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <UserIcon className="h-4 w-4 text-gray-500" /> Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                      <p className="text-xs text-gray-500">
                        This is your display name visible to other users
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <MailIcon className="h-4 w-4 text-gray-500" /> Email
                      </label>
                      <Input
                        id="email"
                        placeholder="Enter your email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={true}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                      <p className="text-xs text-gray-500">
                        Your primary contact email address
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="department"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <BuildingIcon className="h-4 w-4 text-gray-500" />{" "}
                        Department
                      </label>
                      <Input
                        id="department"
                        placeholder="Enter your department"
                        value={formData.department}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                      <p className="text-xs text-gray-500">
                        Your academic department
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="graduationYear"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <GraduationCapIcon className="h-4 w-4 text-gray-500" />{" "}
                        Graduation Year
                      </label>
                      <Input
                        id="graduationYear"
                        type="number"
                        placeholder="Enter graduation year"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                      <p className="text-xs text-gray-500">
                        Your expected year of graduation
                      </p>
                    </div>

                    {/* <div className="space-y-2 md:col-span-2">
                      <label
                        htmlFor="bio"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <BriefcaseIcon className="h-4 w-4 text-gray-500" /> Bio
                      </label>
                      <Textarea
                        id="bio"
                        placeholder="Write a brief bio..."
                        className={`min-h-[120px] ${!isEditing ? "bg-gray-50" : ""}`}
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                      <p className="text-xs text-gray-500">
                        Tell others about yourself, your interests, and your
                        achievements
                      </p>
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
                    <ListChecksIcon className="h-5 w-5 text-indigo-600" />
                    Skills & Contact
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Showcase your skills and provide additional contact
                    information
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2 md:col-span-2">
                      <label
                        htmlFor="skills"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <ListChecksIcon className="h-4 w-4 text-gray-500" />{" "}
                        Skills
                      </label>
                      <Input
                        id="skills"
                        placeholder="Enter skills (comma-separated)"
                        value={formData.skills}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                      <p className="text-xs text-gray-500">
                        List your technical and professional skills, separated
                        by commas
                      </p>

                      {formData.skills && !isEditing && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.skills.split(",").map(
                            (skill, index) =>
                              skill.trim() && (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                                >
                                  {skill.trim()}
                                </span>
                              )
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <PhoneIcon className="h-4 w-4 text-gray-500" /> Phone
                      </label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={true}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                      <p className="text-xs text-gray-500">
                        Your contact phone number (optional)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />{" "}
                        Joined Date
                      </label>
                      <div
                        className={`h-10 px-3 py-2 rounded-md border ${!isEditing ? "bg-gray-50" : ""} text-sm flex items-center text-gray-700`}
                      >
                        {new Date(profile._creationTime).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        The date you joined the platform
                      </p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        className="mr-2"
                        onClick={() => setIsEditing?.(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="gradient"
                        className="gap-2"
                        onClick={handleSave}
                      >
                        <SaveIcon className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Profile;
