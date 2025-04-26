import React, { useEffect, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "@/components/ui/notification-item";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  // Get notifications and count
  const notifications = useQuery(api.notifications.getNotifications, {
    limit: 10,
  });
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  // Handle marking all as read
  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAllAsRead({});
  };

  // Refresh unread count when dropdown closes
  useEffect(() => {
    if (!isOpen && unreadCount !== undefined && unreadCount > 0) {
      // This is a placeholder for any additional actions needed when closing
      // the dropdown with unread notifications
    }
  }, [isOpen, unreadCount]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 text-gray-600"
        >
          <Bell className="h-5 w-5" />
          {unreadCount !== undefined && unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center bg-red-500 text-xs text-white rounded-full min-w-[18px] h-[18px] px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 bg-white">
        <div className="flex items-center justify-between p-3 bg-white border-b">
          <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
          {unreadCount !== undefined && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1"
              onClick={(e) => handleMarkAllAsRead(e)}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all as read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[300px]">
          {notifications === undefined ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-6">
              <Bell className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
