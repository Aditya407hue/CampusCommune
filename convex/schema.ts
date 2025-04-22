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
    title: v.optional(v.string()), // Made optional
    company: v.optional(v.string()), // Made optional
    description: v.optional(v.string()), // Made optional
    location: v.optional(v.string()), // Made optional
    type: v.optional(v.union( // Made optional
      v.literal("full-time"),
      v.literal("internship"),
      v.literal("part-time"),
      v.literal("trainee") // Added trainee type
    )),
    skills: v.optional(v.array(v.string())), // Made optional
    salary: v.optional( // Made optional and changed to object
      v.object({
        stipend: v.optional(v.string()),
        postConfirmationCTC: v.optional(v.string()),
      })
    ),
    deadline: v.optional(v.string()), // Made optional and changed to string to accommodate format like "23rd April, 12pm"
    isActive: v.optional(v.boolean()), // Made optional
    createdBy: v.optional(v.id("users")), // Made optional
    applicationLink: v.optional(v.string()), // Added new field
    moreDetails: v.optional( // Added new field
      v.object({
        eligibility: v.optional(v.string()),
        selectionProcess: v.optional(v.array(v.string())),
        serviceAgreement: v.optional(v.string()),
        training: v.optional(v.string()),
        joiningDate: v.optional(v.string()),
        requiredDocuments: v.optional(v.string()), // Kept as string for simplicity, could be array
        companyWebsite: v.optional(v.string()),
      })
    ),
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
