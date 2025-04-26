import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Package, Mail, Briefcase, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";

interface NotificationItemProps {
  notification: Doc<"notifications">;
  onMarkAsRead?: () => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const markAsRead = useMutation(api.notifications.markAsRead);

  // Handle notification click
  const handleClick = async () => {
    // Mark notification as read
    if (!notification.read) {
      await markAsRead({ notificationId: notification._id });
      if (onMarkAsRead) onMarkAsRead();
    }

    // Navigate if there's an action URL
    if (notification.actionUrl) {
      await navigate(notification.actionUrl);
    }
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case "new_job":
        return <Briefcase className="h-5 w-5 text-blue-500" />;
      case "job_update":
        return <Package className="h-5 w-5 text-purple-500" />;
      case "mail_approval":
        return <Mail className="h-5 w-5 text-green-500" />;
      case "application_status_change":
        return <UserCheck className="h-5 w-5 text-orange-500" />;
      case "new_application":
        return <Check className="h-5 w-5 text-teal-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors",
        notification.read
          ? "bg-white hover:bg-gray-50"
          : "bg-blue-50 hover:bg-blue-100"
      )}
      onClick={() => handleClick}
    >
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm",
            notification.read ? "text-gray-700" : "text-gray-900 font-medium"
          )}
        >
          {notification.message}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {notification.createdAt
            ? formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })
            : ""}
        </p>
      </div>
      {!notification.read && (
        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
      )}
    </div>
  );
}
