import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Import Link for navigation
import { FileText } from "lucide-react"; // Import an icon for the button
import { Doc } from "convex/_generated/dataModel";
import { useEffect, useState } from "react";
import Profile from "../components/Profile/Profile";
import { UserIcon } from "lucide-react";

export function ProfileView({
  profile,
}: {
  profile: Doc<"profiles"> & {
    email: string | undefined;
    phone: string | undefined;
  };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showResumeText, setShowResumeText] = useState(false);

    useEffect(() => {
    // First show only the icon
    setShowResumeText(false);
    
    // After 3 seconds, show the text next to the icon
    const textTimer = setTimeout(() => {
      setShowResumeText(true);
    }, 2000);
    
    // After 6 seconds, show the popup (giving time for text animation to complete)
    
    return () => {
      clearTimeout(textTimer)
    };
  }, []);
  

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile information...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen px-8 bg-gray-50">
      {/* Simple header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 w-full">
        <div className="w-full px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-white" />
              <h1 className="text-2xl font-bold text-white">Your Profile</h1>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="bg-white text-indigo-700 hover:bg-indigo-50 border-none"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </div>

      {/* Profile content */}
      <div className="w-full">
        <Profile
          profile={profile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />

<Link
          to="/ats-analysis"
          className={`fixed bottom-8 right-8 bg-indigo-600 text-white ${showResumeText ? 'px-4 py-2' : 'p-4'} rounded-full shadow-lg hover:bg-indigo-700 hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out transform flex items-center justify-center gap-2`}
          title="Analyze Resume with ATS" 
        >
          <span 
            className={`font-semibold overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${showResumeText ? 'max-w-32 opacity-100 mr-2' : 'max-w-0 opacity-0 mr-0'}`}
          >
            Resume Analysis
          </span>
          <FileText className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}
