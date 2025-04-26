import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const apply = mutation({
  args: {
    jobId: v.id("jobs"),
    // resumeFileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already applied
    const existing = await ctx.db
      .query("applications")
      .withIndex("by_student", (q) => q.eq("studentId", userId))
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .unique();
    if (existing) throw new Error("Already applied");

    // Create application
    const applicationId = await ctx.db.insert("applications", {
      jobId: args.jobId,
      studentId: userId,
      status: "pending",
      appliedAt: Date.now(),
    });

    // Create notification for student
    await ctx.db.insert("notifications", {
      userId,
      type: "status_update",
      message: "Application submitted successfully",
      read: false,
      createdAt: Date.now(),
    });

    return applicationId;
  },
});

export const updateStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("pending"),
      v.literal("shortlisted"),
      v.literal("rejected"),
      v.literal("accepted")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify admin status
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (profile?.role !== "admin") throw new Error("Not authorized");

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error("Application not found");

    // Update status
    await ctx.db.patch(args.applicationId, {
      status: args.status,
    });

    // Create notification for student
    await ctx.db.insert("notifications", {
      userId: application.studentId,
      type: "status_update",
      message: `Your application status has been updated to ${args.status}`,
      read: false,
      createdAt: Date.now(),
    });
  },
});

export const listByStudent = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const applications = await ctx.db
      .query("applications")
      .withIndex("by_student", (q) => q.eq("studentId", userId))
      .collect();

    // Fetch job details for each application
    const applicationsWithJobDetails = await Promise.all(
      applications.map(async (application) => {
        const job = await ctx.db.get(application.jobId);
        return { ...application, job }; // Combine application and job details
      })
    );

    return applicationsWithJobDetails;
  },
});

export const getById = query({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error("Application not found");

    // Check if user is admin or the application owner
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    
    if (profile?.role !== "admin" && application.studentId !== userId) {
      throw new Error("Not authorized");
    }

    return application;
  },
});
