import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Doc } from "convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Added Card imports
import { UserIcon, MailIcon, SettingsIcon, BellIcon, EyeIcon } from 'lucide-react'; // Added icons
import { useState } from 'react'; // Added useState for active tab

const Profile = ({ profile }: {
    profile: Doc<"profiles"> & { email: string | undefined, phone: string| undefined}
}) => {
    // Add state for active sidebar item
    const [activeItem, setActiveItem] = useState('Profile');

    return (
        // Removed min-h-screen and flex-col, assuming parent handles layout
        // Removed bg-muted/5 from main, container handles background
        <div className="container mx-auto px-4 py-8 bg-[#f7f8f9]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar - Styled like Applications sidebar */}
                <nav className="lg:col-span-3 space-y-1">
                    {/* Added icons and active state styling */}
                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-2 ${activeItem === 'Profile' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-muted-foreground'}`}
                        onClick={() => setActiveItem('Profile')}
                    >
                        <UserIcon className="w-4 h-4" />
                        Profile
                    </Button>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-2 ${activeItem === 'Account' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-muted-foreground'}`}
                        onClick={() => setActiveItem('Account')}
                    >
                        <SettingsIcon className="w-4 h-4" />
                        Account
                    </Button>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-2 ${activeItem === 'Appearance' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-muted-foreground'}`}
                        onClick={() => setActiveItem('Appearance')}
                    >
                        <EyeIcon className="w-4 h-4" />
                        Appearance
                    </Button>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-2 ${activeItem === 'Notifications' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-muted-foreground'}`}
                        onClick={() => setActiveItem('Notifications')}
                    >
                        <BellIcon className="w-4 h-4" />
                        Notifications
                    </Button>
                    {/* Removed Display button as it wasn't handled */}
                </nav>

                {/* Main Content - Wrapped in Card */}
                <div className="lg:col-span-9">
                    <Card className="shadow-sm"> {/* Added Card wrapper */} 
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold tracking-tight">Profile</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                This is how others will see you on the site.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Separator />

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Username</label> 
                                    <Input id="username" placeholder="Enter username" defaultValue={profile.name} /> 
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        This is your public display name. It can be your real name or a pseudonym.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label> 
                                    <Select defaultValue={profile.email} name="email"> 
                                        <SelectTrigger id="email">
                                            <SelectValue placeholder="Select a verified email to display" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Assuming profile.email holds the verified email */}
                                            <SelectItem value={profile.email || 'no-email'}>{profile.email || 'No email verified'}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        You can manage verified email addresses in your email settings.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="bio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Bio</label> 
                                    <Textarea id="bio" placeholder="Write a brief bio..." className="min-h-[100px]" defaultValue={profile.name || ''} /> 
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        You can @mention other users and organizations to link to them.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="department" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Department</label>
                                    <Input id="department" placeholder="Enter department" defaultValue={profile.department} />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Your academic department.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="graduationYear" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Graduation Year</label>
                                    <Input id="graduationYear" type="number" placeholder="Enter graduation year" defaultValue={profile.graduationYear} />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Your expected year of graduation.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="skills" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Skills</label>
                                    <Input id="skills" placeholder="Enter skills (comma-separated)" defaultValue={profile.skills?.join(', ') || ''} />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        List your skills, separated by commas.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phone</label>
                                    <Input id="phone" placeholder="Enter phone number" defaultValue={profile.phone || ''} />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Your contact phone number (optional).
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    {/* Styled button like Dashboard primary buttons */}
                                    <Button className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 hover:scale-105 hover:shadow-md">Save changes</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;