import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

// Helper function to notify users about job events
async function notifyUsersAboutJob(
  ctx: any,
  jobId: Id<"jobs">,
  type: "new_job" | "job_update",
  message: string,
  actionUrl?: string
) {
  // Get all users to notify (in a real app, this would be filtered by preferences)
  const users = await ctx.db.query("users").collect();

  // Notify each user
  for (const user of users) {
    await ctx.db.insert("notifications", {
      userId: user._id,
      type,
      message,
      read: false,
      createdAt: Date.now(),
      relatedId: jobId,
      actionUrl,
    });
  }
}

export const create = mutation({
  args: {
    title: v.optional(v.union(v.string(), v.null())), // Made optional
    company: v.optional(v.union(v.string(), v.null())), // Made optional
    description: v.optional(v.union(v.string(), v.null())), // Made optional
    location: v.optional(v.union(v.string(), v.null())), // Made optional
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
    mailId: v.id("mails"), // Added mailId argument
  },
  handler: async (ctx, args) => {
    // Destructure args to handle them correctly
    const { salary, applicationLink, moreDetails, ...restArgs } = args;
    console.log(args);

    // Insert the job
    const jobId = await ctx.db.insert("jobs", {
      ...restArgs, // Spread the rest of the arguments
      salary: salary, // Pass the salary object (or undefined) explicitly
      applicationLink: applicationLink,
      moreDetails: moreDetails, // Pass the more details object
      isActive: true,
      // isApproved: false, // Default to not approved
      mailId: args.mailId, // Save the mailId
    });

    // Create notification for new job
    const title = args.title || "Untitled Job";
    const company = args.company || "Unknown Company";
    await notifyUsersAboutJob(
      ctx,
      jobId,
      "new_job",
      `New job opportunity: ${title} at ${company}`,
      `/jobs`
    );

    return jobId;
  },
});

export const list = query({
  args: {
    onlyActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const q = ctx.db.query("jobs");
    if (args.onlyActive) {
      return await q
        .withIndex("by_active", (q) => q.eq("isActive", true))
        .collect();
    }
    return await q.collect();
  },
});

export const getById = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

export const listActiveJobs = query({
  args: {},
  handler: async (ctx) => {
    // Get the current authenticated user
    const userId = await getAuthUserId(ctx);

    // Get all active jobs
    const activeJobs = await ctx.db
      .query("jobs")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    // Process each job to add status information
    const processedJobs = await Promise.all(
      activeJobs.map(async (job) => {
        // Default status
        let approvalStatus = "approved";
        let hasApplied = false;

        // Check mail approval status
        if (job.mailId) {
          const mail = await ctx.db.get(job.mailId);
          if (!mail?.isApproved) {
            approvalStatus = "pending";
          }
        }

        // Check if user has applied (only if user is authenticated)
        if (userId) {
          const applications = await ctx.db
            .query("applications")
            .withIndex("by_job", (q) => q.eq("jobId", job._id))
            .collect();

          hasApplied = applications.some((app) => app.studentId === userId);
        }

        // Return the job with added status fields
        return {
          ...job,
          status: {
            approvalStatus,
            hasApplied,
          },
        };
      })
    );

    return processedJobs;
  },
});

export const getJobByMailId = query({
  args: { mailId: v.id("mails") },
  handler: async (ctx, args) => {
    const { mailId } = args;
    if (mailId === "") return null;
    const job = await ctx.db
      .query("jobs")
      .withIndex("by_mailId", (q) => q.eq("mailId", mailId))
      .collect();
    console.log("Job by mailId:", job);
    if (job.length > 0) return job[0];
    if (!job) return null;
  },
});

export const update = mutation({
  args: {
    jobId: v.id("jobs"),
    title: v.optional(v.union(v.string(), v.null())), // Made optional
    company: v.optional(v.union(v.string(), v.null())), // Made optional
    description: v.optional(v.union(v.string(), v.null())), // Made optional
    location: v.optional(v.union(v.string(), v.null())), // Made optional
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
  },
  handler: async (ctx, args) => {
    const { jobId, ...restArgs } = args;
    const job = await ctx.db.get(jobId);
    if (!job) throw new Error("Job not found");

    // Update the job
    await ctx.db.patch(jobId, {
      ...restArgs, // Spread the rest of the arguments
      salary: restArgs.salary,
      applicationLink: restArgs.applicationLink,
      moreDetails: restArgs.moreDetails, // Pass the more details object
      // updatedAt: new Date().toISOString(),
    });

    // Create notification for job update
    const title = args.title || job.title || "Untitled Job";
    const company = args.company || job.company || "Unknown Company";
    await notifyUsersAboutJob(
      ctx,
      jobId,
      "job_update",
      `Job updated: ${title} at ${company}`,
      `/jobs`
    );

    return jobId;
  },
});

export const deleteJob = mutation({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    return await ctx.db.delete(args.jobId);
  },
});

export const listActiveCompanies = query({
  args: {},
  handler: async (ctx) => {
    const activeJobs = await ctx.db
      .query("jobs")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return activeJobs;
  },
});
