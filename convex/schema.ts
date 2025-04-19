import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Define our application tables
const applicationTables = {
  profiles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("student"), v.literal("admin")),
    name: v.string(),
    department: v.string(),
    graduationYear: v.number(),
    skills: v.array(v.string()),
    resumeFileId: v.optional(v.id("_storage")),
  }).index("by_user", ["userId"]),

  jobs: defineTable({
    title: v.string(),
    company: v.string(),
    description: v.string(),
    location: v.string(),
    type: v.union(
      v.literal("full-time"),
      v.literal("internship"),
      v.literal("part-time")
    ),
    skills: v.array(v.string()),
    salary: v.optional(v.number()),
    deadline: v.number(), // Unix timestamp
    isActive: v.boolean(),
    createdBy: v.id("users"),
  })
    .index("by_active", ["isActive"])
    .index("by_deadline", ["deadline"]),

  applications: defineTable({
    jobId: v.id("jobs"),
    studentId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("shortlisted"),
      v.literal("rejected"),
      v.literal("accepted")
    ),
    appliedAt: v.number(),
    resumeFileId: v.id("_storage"),
  })
    .index("by_student", ["studentId"])
    .index("by_job", ["jobId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("new_job"),
      v.literal("status_update"),
      v.literal("deadline_reminder")
    ),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_user_unread", ["userId", "read"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
