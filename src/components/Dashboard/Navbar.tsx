import { Button } from "../../components/ui/button";
import Lottie from "react-lottie";
import logoAnimation from "@/lotties/create-acc.json";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, X} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@/SignOutButton";
import { useState } from "react";
import { NotificationDropdown } from "@/components/ui/notification-dropdown";

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const isAdmin = useQuery(api.users.isAdmin);
  const userIsPR = useQuery(api.users.isPR);

  const logoOptions = {
    loop: true,
    autoplay: true,
    animationData: logoAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    if (userIsPR) {
      return [
        { href: "/jobs", label: "Post Jobs" },
        { href: "/profile", label: "Profile" },
      ];
    }

    if (isAdmin) {
      return [
        { href: "/", label: "Home" },
        { href: "/jobs", label: "Jobs" },
        { href: "/applications", label: "Applications" },
        { href: "/profile", label: "Profile" },
      ];
    }

    // Default items for students
    return [
      { href: "/", label: "Home" },
      { href: "/jobs", label: "Find Jobs" },
      { href: "/applications", label: "Applications" },
      { href: "/profile", label: "Profile" },
    ];
  };

  const navItems = getNavItems();

  // Only show Post Job button for PR users and admins
  const showPostJob = userIsPR || isAdmin;

  return (
    <header className="w-full py-3 border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Lottie options={logoOptions} height={45} width={45} />
            </div>
            <div className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Campus Commune
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Replace the bell button with our notification dropdown */}
            <NotificationDropdown />

            {showPostJob && (
              <Button
                variant="ghost"
                className="bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-600"
              >
                <Link to="/job-editor">Post a Job</Link>
              </Button>
            )}

            <DropdownMenu open={isAccountMenuOpen} onOpenChange={setIsAccountMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="bg-gradient-to-r text-white from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <span>Account</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white w-48">
                <DropdownMenuItem className="cursor-pointer" onClick={() => setIsAccountMenuOpen(false)}>
                  <Link to="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAccountMenuOpen(false)}>
                  <Link to="/applications" className="w-full">
                    Applications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAccountMenuOpen(false)}>
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Telegram Link - Improved styling */}
            <a
              href="https://t.me/CampusCommune"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-indigo-600 transition-all duration-200"
              aria-label="Join our Telegram channel"
            >
              <img src="https://imgs.search.brave.com/mZubhDzUuUTVFDwofyxpHZBhUe2dVW4xJSmUoDjlFmo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy84/LzgyL1RlbGVncmFt/X2xvZ28uc3Zn" alt="Telegram" className="h-5 w-5" />
              <span className="text-sm font-medium">Join Channel</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-2">
              {/* Add notification bell in mobile menu */}
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-medium text-gray-600">
                  Notifications
                </span>
                <NotificationDropdown />
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {showPostJob && (
                <Link
                  to="/jobs/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100"
                >
                  Post a Job
                </Link>
              )}
              {/* Telegram Link in mobile menu */}
              <a
                href="https://t.me/CampusCommune"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-indigo-600 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
                aria-label="Join our Telegram channel"
              >
                <img src="https://imgs.search.brave.com/mZubhDzUuUTVFDwofyxpHZBhUe2dVW4xJSmUoDjlFmo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy84/LzgyL1RlbGVncmFt/X2xvZ28uc3Zn" alt="Telegram" className="h-5 w-5" />
                <span>Join Telegram Channel</span>
              </a>
              
              <div className="pt-2 mt-2 border-t border-gray-100">
                <SignOutButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
