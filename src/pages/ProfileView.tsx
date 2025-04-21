import { Button } from "@/components/ui/button";
import { Doc } from "convex/_generated/dataModel";
import { useState } from "react";
import Profile from "../components/Profile/Profile";

export function ProfileView({ profile }: { profile: Doc<"profiles"> & { email: string | undefined, phone: string| undefined} }) { // Add ProfileView definition if missing or incomplete
    // const updateProfile = useMutation(api.users.updateProfile);
    const [isEditing, setIsEditing] = useState(false);
  
    if (!profile) {
      return <div>Loading profile...</div>; // Or some other loading state
    }
  
    // return (
    //   <div className="max-w-2xl mx-auto">
    //     <div className="flex justify-between items-center mb-6">
    //       <h1 className="text-2xl font-bold">Your Profile</h1>
    //       <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
    //         {isEditing ? "Cancel" : "Edit Profile"}
    //       </Button>
    //     </div>
  
    //     {isEditing ? (
    //       <EditProfileForm profile={profile} onSave={() => setIsEditing(false)} />
    //     ) : (
    //       <Card>
    //         <CardContent className="p-6 space-y-4">
    //           <p><strong>Name:</strong> {profile.name}</p>
    //           <p><strong>Role:</strong> <span className="capitalize">{profile.role}</span></p>
    //           <p><strong>Department:</strong> {profile.department}</p>
    //           <p><strong>Graduation Year:</strong> {profile.graduationYear}</p>
    //           <p><strong>Skills:</strong> {profile.skills?.join(', ') || 'N/A'}</p>
    //           {/* Add other profile details here */}
    //         </CardContent>
    //       </Card>
    //     )}
    //   </div>
    // );
  
    return (
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
            {isEditing? "Cancel" : "Edit Profile"}
          </Button>
        </div>
  
        <Profile profile={profile}/>
      </div>
      
    )
  
  }