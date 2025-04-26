import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all notifications for a user
export const getNotifications = query({
  args: {
    limit: v.optional(v.number()),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await getAuthUserId(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity;

    // Look up the user by tokenIdentifier
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const limit = args.limit ?? 20;
    let notificationsQuery = ctx.db
      .query("notifications")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .order("desc");

    if (args.unreadOnly) {
      notificationsQuery = ctx.db
        .query("notifications")
        .withIndex("by_user_unread", (q) =>
          q.eq("userId", user._id).eq("read", false)
        )
        .order("desc");
    }

    return await notificationsQuery.take(limit);
  },
});

// Create a notification
export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("new_job"),
      v.literal("status_update"),
      v.literal("deadline_reminder"),
      v.literal("job_update"),
      v.literal("mail_approval"),
      v.literal("application_status_change"),
      v.literal("new_application")
    ),
    message: v.string(),
    relatedId: v.optional(
      v.union(v.id("jobs"), v.id("applications"), v.id("mails"), v.null())
    ),
    actionUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Create the notification
    return await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      message: args.message,
      read: false,
      createdAt: Date.now(),
      relatedId: args.relatedId,
      actionUrl: args.actionUrl,
    });
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const identity = await getAuthUserId(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", identity))
      .first();

    if (!user || notification.userId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.notificationId, {
      read: true,
    });

    return { success: true };
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await getAuthUserId(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", identity))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get all unread notifications
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) =>
        q.eq("userId", user._id).eq("read", false)
      )
      .collect();

    // Update all notifications
    await Promise.all(
      unreadNotifications.map((notification) =>
        ctx.db.patch(notification._id, { read: true })
      )
    );

    return { success: true, count: unreadNotifications.length };
  },
});

// Get unread notification count
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await getAuthUserId(ctx);
    if (!identity) {
      return 0;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", identity))
      .first();

    if (!user) {
      return 0;
    }

    return await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) =>
        q.eq("userId", user._id).eq("read", false)
      )
      .collect()
      .then((q) => q.length);
  },
});
