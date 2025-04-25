import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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
    // const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");

    // Verify admin status

    // const profile = await ctx.db
    //   .query("profiles")
    //   .withIndex("by_user", (q) => q.eq("userId", userId))
    //   .unique();
    // if (profile?.role !== "admin") throw new Error("Not authorized");

    // Destructure args to handle them correctly
    const { salary, applicationLink, moreDetails, ...restArgs } = args;
    console.log(args);
    return await ctx.db.insert("jobs", {
      ...restArgs, // Spread the rest of the arguments
      salary: salary, // Pass the salary object (or undefined) explicitly
      applicationLink: applicationLink,
      moreDetails: moreDetails, // Pass the more details object
      isActive: true,
      isApproved: false, // Default to not approved
      mailId: args.mailId, // Save the mailId
    });
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
  returns: v.array(v.object({ company: v.string() })),
  handler: async (ctx, args) => {
    const activeJobs = await ctx.db
      .query("jobs")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    return activeJobs
      .filter((job) => job.company != null)
      .map((job) => ({ company: job.company! }));
  },
});
