import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Define our application tables
const applicationTables = {
  profiles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("student"), v.literal("admin"), v.literal("pr")), // Added PR role
    name: v.string(),
    department: v.string(),
    graduationYear: v.number(),
    skills: v.array(v.string()),
    resumeFileId: v.optional(v.id("_storage")),
  }).index("by_user", ["userId"]),

  jobs: defineTable({
    title: v.optional(v.union(v.string(), v.null())), // Made optional
    company: v.optional(v.union(v.string(), v.null())), // Made optional
    description: v.optional(v.union(v.string(), v.null())), // Made optional
    location: v.optional(v.union(v.string(), v.null())), // Made optional
    // isApproved: v.optional(v.boolean()), // Added new field
    // approvedBy: v.optional(v.id("users")), // Made optional
    type: v.optional(
      v.union(
        // Made optional
        v.literal("full-time"),
        v.literal("internship"),
        v.literal("part-time"),
        v.literal("trainee") // Added trainee type
      )
    ),
    skills: v.optional(v.array(v.string())), // Made optional
    salary: v.optional(
      v.union(
        // Made optional and changed to object
        v.object({
          stipend: v.optional(v.union(v.string(), v.null())),
          postConfirmationCTC: v.optional(v.union(v.string(), v.null())),
        }),
        v.null()
      )
    ),
    deadline: v.optional(v.union(v.string(), v.null())), // Made optional and changed to string to accommodate format like "23rd April, 12pm"
    isActive: v.optional(v.boolean()), // Made optional
    createdBy: v.optional(v.id("users")), // Made optional
    applicationLink: v.optional(v.union(v.array(v.string()), v.null())), // Added new field
    moreDetails: v.optional(
      v.union(
        // Added new field
        v.object({
          eligibility: v.optional(v.union(v.string(), v.null())),
          selectionProcess: v.optional(v.array(v.string())),
          serviceAgreement: v.optional(v.union(v.string(), v.null())),
          training: v.optional(v.union(v.string(), v.null())),
          joiningDate: v.optional(v.union(v.string(), v.null())),
          requiredDocuments: v.optional(v.union(v.string(), v.null())), // Kept as string for simplicity, could be array
          companyWebsite: v.optional(v.union(v.string(), v.null())),
        }),
        v.null()
      )
    ),
    mailId: v.id("mails"),
  })
    .index("by_active", ["isActive"])
    .index("by_deadline", ["deadline"])
    .index("by_createdBy", ["createdBy"])
    .index("by_mailId", ["mailId"])
    .index("by_title", ["title"])
    .index("by_company", ["company"]),

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
    resumeFileId: v.optional(v.union(v.id("_storage"), v.null())),
  })
    .index("by_student", ["studentId"])
    .index("by_job", ["jobId"]),

  notifications: defineTable({
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
    read: v.boolean(),
    createdAt: v.number(),
    relatedId: v.optional(
      v.union(v.id("jobs"), v.id("applications"), v.id("mails"), v.null())
    ),
    actionUrl: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "read"])
    .index("by_user_date", ["userId", "createdAt"]),

  mails: defineTable({
    mailContent: v.string(),
    noOfAttachments: v.number(),
    attachmentLinks: v.array(v.string()),
    companyName: v.optional(v.union(v.string(), v.null())),
    subject: v.optional(v.union(v.string(), v.null())),
    classification: v.string(),
    reason: v.string(),
    isApproved: v.boolean(),
    approvedBy: v.optional(v.id("users")),
  }).index("by_isApproved", ["isApproved"]),

  jobUpdates: defineTable({
    summary: v.optional(v.union(v.string(), v.null())),
    mailId: v.id("mails"),
    jobId: v.id("jobs"),
  })
    .index("by_mailId", ["mailId"])
    .index("by_jobId", ["jobId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
