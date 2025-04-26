import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    summary: v.optional(v.union(v.string(), v.null())),
    mailId: v.id("mails"),
    companyName: v.string(),
  },
  handler: async (ctx, args) => {
    // const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");

    // Verify admin status
    const job = await ctx.db
      .query("jobs")
      .filter((q) => q.eq(q.field("company"), args.companyName))
      .unique();

    if (!job) throw new Error("Job not found");

    // Destructure args to handle them correctly
    const { mailId, summary } = args;

    return await ctx.db.insert("jobUpdates", {
      summary: summary,
      mailId: mailId,
      jobId: job._id,
    });
  },
});

export const getJobUpdateByMailId = query({
  args: {
    mailId: v.id("mails"),
  },
  handler: async (ctx, args) => {
    const { mailId } = args;
    console.log("mailId", mailId);
    if (mailId === "") {
      return undefined;
    }
    const jobUpdates = await ctx.db
      .query("jobUpdates")
      .withIndex("by_mailId", (q) => q.eq("mailId", mailId))
      .collect();
    console.log("jobUpdates", jobUpdates);
    return jobUpdates;
  },
});

export const update = mutation({
  args: {
    jobUpdateId: v.id("jobUpdates"),
    summary: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const { jobUpdateId, summary } = args;
    const jobUpdate = await ctx.db.get(jobUpdateId);
    if (!jobUpdate) return null;

    return await ctx.db.patch(jobUpdateId, {
      summary: summary,
      // updatedAt: new Date().toISOString(),
    });
  },
});

export const deleteJobUpdate = mutation({
  args: {
    jobUpdateId: v.id("jobUpdates"),
  },
  handler: async (ctx, args) => {
    const { jobUpdateId } = args;
    const jobUpdate = await ctx.db.get(jobUpdateId);
    if (!jobUpdate) throw new Error("Job update not found");

    return await ctx.db.delete(jobUpdateId);
  },
});
